const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');
const Pitch = require('../models/Pitch');

// send message: body { toUserId, text, conversationId? }
const acceptedStatuses = [
  'PITCH_ACCEPTED',
  'WORK_IN_PROGRESS',
  'WORK_SUBMITTED',
  'APPROVAL_PENDING',
  'APPROVED',
  'DISPUTED',
  'COMPLETED'
];

async function hasAcceptedPitchBetween(userA, userB) {
  // find a pitch where one is creator and other is brand and status is accepted or later
  const pitch = await Pitch.findOne({
    $or: [
      { creatorId: userA, brandId: userB, status: { $in: acceptedStatuses } },
      { creatorId: userB, brandId: userA, status: { $in: acceptedStatuses } }
    ]
  });
  return !!pitch;
}

exports.sendMessage = async (req, res) => {
  const { toUserId, text, conversationId } = req.body;
  if (!toUserId || !text) return res.status(400).json({ message: 'toUserId and text required' });

  // ensure users are connected via an accepted pitch
  const connected = await hasAcceptedPitchBetween(req.user._id, toUserId);
  if (!connected) return res.status(403).json({ message: 'Messaging not allowed: no accepted pitch between users' });

  let conv = null;
  if (conversationId) {
    conv = await Conversation.findById(conversationId);
    if (!conv) return res.status(404).json({ message: 'Conversation not found' });
    // ensure requester is a participant
    if (!conv.participants.map(p => String(p)).includes(String(req.user._id))) return res.status(403).json({ message: 'Not a participant' });
  } else {
    // find existing conversation between these two users
    conv = await Conversation.findOne({ participants: { $all: [req.user._id, toUserId] } });
    if (!conv) {
      conv = await Conversation.create({ participants: [req.user._id, toUserId], messages: [] });
    }
  }
  conv.messages.push({ sender: req.user._id, text });
  conv.updatedAt = new Date();
  await conv.save();
  // notification to recipient
  await Notification.create({ userId: toUserId, type: 'NEW_MESSAGE', payload: { conversationId: conv._id, from: req.user._id, text } });
  res.json(conv);
};

exports.getConversation = async (req, res) => {
  const { id } = req.params;
  const conv = await Conversation.findById(id).populate('messages.sender', 'name');
  if (!conv) return res.status(404).json({ message: 'Conversation not found' });
  // ensure requester is a participant
  if (!conv.participants.map(p => String(p)).includes(String(req.user._id))) return res.status(403).json({ message: 'Not a participant' });

  // ensure there's an accepted pitch between the two participants
  const other = conv.participants.find(p => String(p) !== String(req.user._id));
  if (other) {
    const connected = await hasAcceptedPitchBetween(req.user._id, other);
    if (!connected) return res.status(403).json({ message: 'Messaging not allowed: no accepted pitch between users' });
  }
  res.json(conv);
};

exports.getOrCreateWithUser = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: 'userId required' });
  // ensure users are connected via accepted pitch before creating conversation
  const connected = await hasAcceptedPitchBetween(req.user._id, userId);
  if (!connected) return res.status(403).json({ message: 'Messaging not allowed: no accepted pitch between users' });

  let conv = await Conversation.findOne({ participants: { $all: [req.user._id, userId] } }).populate('messages.sender', 'name');
  if (!conv) {
    conv = await Conversation.create({ participants: [req.user._id, userId], messages: [] });
  }
  res.json(conv);
};

exports.listConversations = async (req, res) => {
  const convsRaw = await Conversation.find({ participants: req.user._id }).sort('-updatedAt').limit(50).populate('messages.sender', 'name');
  // filter to only include conversations where an accepted pitch exists
  const convs = [];
  for (const c of convsRaw) {
    const other = c.participants.find(p => String(p) !== String(req.user._id));
    if (!other) continue;
    const connected = await hasAcceptedPitchBetween(req.user._id, other);
    if (connected) convs.push(c);
  }
  res.json(convs);
};
