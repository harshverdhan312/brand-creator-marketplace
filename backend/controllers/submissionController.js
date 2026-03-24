const Submission = require('../models/Submission');
const Escrow = require('../models/Escrow');
const Pitch = require('../models/Pitch');
const Dispute = require('../models/Dispute');
const Notification = require('../models/Notification');
const escrowService = require('../utils/escrowService');
const mongoose = require('mongoose');

exports.createSubmission = async (req, res) => {
  const { escrowId, pitchId, deliverables, notes } = req.body;
  if (!escrowId || !mongoose.Types.ObjectId.isValid(escrowId)) {
    return res.status(400).json({ message: 'Invalid escrow ID format' });
  }
  if (pitchId && !mongoose.Types.ObjectId.isValid(pitchId)) {
    return res.status(400).json({ message: 'Invalid pitch ID format' });
  }
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) return res.status(404).json({ message: 'Escrow not found' });
  if (String(escrow.creatorId) !== String(req.user._id)) return res.status(403).json({ message: 'Not creator' });

  const submission = await Submission.create({ escrowId, pitchId, creatorId: req.user._id, brandId: escrow.brandId, deliverables, notes, status: 'SUBMITTED' });

  // update pitch if available
  if (pitchId) {
    const pitch = await Pitch.findById(pitchId);
    if (pitch) {
      pitch.status = 'WORK_SUBMITTED';
      await pitch.save();
    }
  }

  await Notification.create({
    userId: escrow.brandId,
    type: 'WORK_SUBMITTED',
    payload: {
      submissionId: submission._id,
      escrowId,
      referenceId: submission._id,
      entityId: submission._id,
      link: `/dashboard?submissionId=${submission._id}&pitchId=${pitchId || ''}`,
      message: 'New work has been submitted for your review'
    }
  });
  res.json(submission);
};

exports.acceptSubmission = async (req, res) => {
  const { id } = req.params; // submission id
  const submission = await Submission.findById(id);
  if (!submission) return res.status(404).json({ message: 'Submission not found' });
  if (String(submission.brandId) !== String(req.user._id)) return res.status(403).json({ message: 'Not brand' });

  submission.status = 'ACCEPTED';
  await submission.save();

  // release escrow
  await escrowService.releaseEscrow(submission.escrowId);

  // update pitch status
  if (submission.pitchId) {
    const pitch = await Pitch.findById(submission.pitchId);
    if (pitch) { pitch.status = 'COMPLETED'; await pitch.save(); }
  }

  await Notification.create({
    userId: submission.creatorId,
    type: 'PAYMENT_RELEASED',
    payload: {
      submissionId: submission._id,
      escrowId: submission.escrowId,
      referenceId: submission.escrowId,
      entityId: submission._id,
      link: '/dashboard',
      message: 'Payment was released for your completed work'
    }
  });
  res.json(submission);
};

exports.rejectSubmission = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const submission = await Submission.findById(id);
  if (!submission) return res.status(404).json({ message: 'Submission not found' });
  if (String(submission.brandId) !== String(req.user._id)) return res.status(403).json({ message: 'Not brand' });

  submission.status = 'REJECTED';
  submission.rejectionReason = reason || '';
  await submission.save();

  // create dispute
  const dispute = await Dispute.create({ escrowId: submission.escrowId, pitchId: submission.pitchId, creatorId: submission.creatorId, brandId: submission.brandId, reason });
  await Notification.create({
    userId: submission.creatorId,
    type: 'DISPUTE_OPENED',
    payload: {
      disputeId: dispute._id,
      reason,
      referenceId: dispute._id,
      entityId: dispute._id,
      link: '/dashboard',
      message: reason || 'A dispute was opened for your submission'
    }
  });
  res.json({ dispute, submission });
};

exports.getSubmissionsForCreator = async (req, res) => {
  const subs = await Submission.find({ creatorId: req.user._id }).populate('escrowId brandId');
  res.json(subs);
};

exports.getSubmissionsForBrand = async (req, res) => {
  const subs = await Submission.find({ brandId: req.user._id }).populate('escrowId creatorId');
  res.json(subs);
};
