import { Router, type IRouter } from 'express';
import { authMiddleware, AuthRequest } from '@/middleware/authMiddleware';
import { questService } from '@/services/QuestService';

const router: IRouter = Router();

// All quest routes require authentication
router.use(authMiddleware);

// GET /api/v1/quests/templates - Get quest templates (must be before /:id)
router.get('/templates', async (_req: AuthRequest, res) => {
  const templates = await questService.getTemplates();

  return res.json({
    success: true,
    data: templates,
  });
});

// POST /api/v1/quests/from-template - Create quest from template
router.post('/from-template', async (req: AuthRequest, res) => {
  const { templateId } = req.body;

  if (!templateId) {
    return res.status(400).json({
      success: false,
      error: { message: 'templateId is required' },
    });
  }

  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized' },
    });
  }

  const quest = await questService.createFromTemplate(userId, templateId);

  return res.status(201).json({
    success: true,
    data: quest,
  });
});

// GET /api/v1/quests - Get user's quests
router.get('/', async (req: AuthRequest, res) => {
  const { isActive } = req.query;
  const quests = await questService.getUserQuests(
    req.userId!,
    isActive === 'true' ? true : isActive === 'false' ? false : undefined
  );

  res.json({
    success: true,
    data: quests,
  });
});

// POST /api/v1/quests - Create new quest
router.post('/', async (req: AuthRequest, res) => {
  const quest = await questService.createQuest(req.userId!, req.body);

  res.status(201).json({
    success: true,
    data: quest,
  });
});

// PATCH /api/v1/quests/:id - Update quest
router.patch('/:id', async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized' },
    });
  }

  const questId = req.params.id;
  if (!questId) {
    return res.status(400).json({
      success: false,
      error: { message: 'Quest ID is required' },
    });
  }

  const quest = await questService.updateQuest(questId, userId, req.body);

  return res.json({
    success: true,
    data: quest,
  });
});

// PATCH /api/v1/quests/:id/toggle - Toggle quest activation
router.patch('/:id/toggle', async (req: AuthRequest, res) => {
  const { isActive } = req.body;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized' },
    });
  }

  const questId = req.params.id;
  if (!questId) {
    return res.status(400).json({
      success: false,
      error: { message: 'Quest ID is required' },
    });
  }

  const quest = await questService.toggleQuest(questId, userId, isActive);

  return res.json({
    success: true,
    data: quest,
  });
});

// POST /api/v1/quests/:id/complete - Complete quest
router.post('/:id/complete', async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized' },
    });
  }

  const questId = req.params.id;
  if (!questId) {
    return res.status(400).json({
      success: false,
      error: { message: 'Quest ID is required' },
    });
  }

  const result = await questService.completeQuest(questId, userId);

  return res.json({
    success: true,
    data: result,
  });
});

// DELETE /api/v1/quests/:id - Delete quest
router.delete('/:id', async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized' },
    });
  }

  const questId = req.params.id;
  if (!questId) {
    return res.status(400).json({
      success: false,
      error: { message: 'Quest ID is required' },
    });
  }

  const result = await questService.deleteQuest(questId, userId);

  return res.json({
    success: true,
    data: result,
  });
});

export default router;
