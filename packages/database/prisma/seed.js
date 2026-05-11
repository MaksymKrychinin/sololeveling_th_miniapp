"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var questTemplates, _i, questTemplates_1, template, achievements, _a, achievements_1, achievement;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🌱 Seeding database...');
                    // Clear existing data
                    console.log('🧹 Clearing existing data...');
                    return [4 /*yield*/, prisma.questCompletion.deleteMany()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, prisma.userAchievement.deleteMany()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, prisma.quest.deleteMany()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, prisma.questTemplate.deleteMany()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, prisma.achievement.deleteMany()];
                case 5:
                    _b.sent();
                    // Quest templates
                    console.log('📋 Creating quest templates...');
                    questTemplates = [
                        { title: 'Morning Shower', description: 'Take a refreshing morning shower', category: 'hygiene', xpReward: 10, statBonus: { stat: 'vitality', amount: 1 }, frequency: 'daily', icon: '🚿', difficulty: 'easy', isDefault: true },
                        { title: 'Brush Teeth', description: 'Brush your teeth', category: 'hygiene', xpReward: 5, statBonus: { stat: 'vitality', amount: 1 }, frequency: 'daily', icon: '🪥', difficulty: 'easy', isDefault: true },
                        { title: 'Drink Water', description: 'Drink 8 glasses of water', category: 'health', xpReward: 15, statBonus: { stat: 'vitality', amount: 2 }, frequency: 'daily', icon: '💧', difficulty: 'medium', isDefault: true },
                        { title: 'Healthy Breakfast', description: 'Eat a nutritious breakfast', category: 'health', xpReward: 10, statBonus: { stat: 'vitality', amount: 1 }, frequency: 'daily', icon: '🥗', difficulty: 'easy', isDefault: true },
                        { title: 'Morning Run', description: 'Go for a 30-minute run', category: 'fitness', xpReward: 20, statBonus: { stat: 'agility', amount: 2 }, frequency: 'daily', icon: '🏃', difficulty: 'medium', isDefault: true },
                        { title: 'Gym Workout', description: 'Complete a gym workout', category: 'fitness', xpReward: 25, statBonus: { stat: 'strength', amount: 2 }, frequency: 'daily', icon: '💪', difficulty: 'hard', isDefault: true },
                        { title: 'Read 30 Minutes', description: 'Read a book', category: 'learning', xpReward: 20, statBonus: { stat: 'intelligence', amount: 2 }, frequency: 'daily', icon: '📚', difficulty: 'medium', isDefault: true },
                        { title: 'Learn New Words', description: 'Expand vocabulary', category: 'learning', xpReward: 15, statBonus: { stat: 'intelligence', amount: 2 }, frequency: 'daily', icon: '📖', difficulty: 'medium', isDefault: true },
                        { title: 'Meditation', description: 'Meditate for 15 minutes', category: 'mindfulness', xpReward: 15, statBonus: { stat: 'sense', amount: 2 }, frequency: 'daily', icon: '🧘', difficulty: 'medium', isDefault: true },
                        { title: 'Journaling', description: 'Write in journal', category: 'mindfulness', xpReward: 10, statBonus: { stat: 'sense', amount: 1 }, frequency: 'daily', icon: '📝', difficulty: 'easy', isDefault: true },
                        { title: 'Complete Main Task', description: 'Complete important task', category: 'productivity', xpReward: 25, statBonus: null, frequency: 'daily', icon: '⚡', difficulty: 'hard', isDefault: true },
                        { title: 'Plan Tomorrow', description: 'Plan tasks for tomorrow', category: 'productivity', xpReward: 10, statBonus: { stat: 'intelligence', amount: 1 }, frequency: 'daily', icon: '📅', difficulty: 'easy', isDefault: true },
                    ];
                    _i = 0, questTemplates_1 = questTemplates;
                    _b.label = 6;
                case 6:
                    if (!(_i < questTemplates_1.length)) return [3 /*break*/, 9];
                    template = questTemplates_1[_i];
                    return [4 /*yield*/, prisma.questTemplate.create({ data: template })];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    console.log("\u2705 Created ".concat(questTemplates.length, " quest templates"));
                    // Achievements
                    console.log('🏆 Creating achievements...');
                    achievements = [
                        { title: 'First Step', description: 'Complete your first quest', icon: '👣', rarity: 'common', requirement: { type: 'total_quests', value: 1 } },
                        { title: 'Getting Started', description: 'Reach level 10', icon: '🎯', rarity: 'common', requirement: { type: 'level', value: 10 } },
                        { title: '7 Day Warrior', description: 'Maintain 7-day streak', icon: '🔥', rarity: 'rare', requirement: { type: 'streak', value: 7 } },
                        { title: 'Quest Master', description: 'Complete 50 quests', icon: '⭐', rarity: 'rare', requirement: { type: 'total_quests', value: 50 } },
                        { title: 'Month Champion', description: 'Maintain 30-day streak', icon: '💎', rarity: 'epic', requirement: { type: 'streak', value: 30 } },
                        { title: 'Centurion', description: 'Complete 100 quests', icon: '💯', rarity: 'epic', requirement: { type: 'total_quests', value: 100 } },
                        { title: 'S-Rank Hunter', description: 'Reach level 100', icon: '👑', rarity: 'legendary', requirement: { type: 'level', value: 100 } },
                        { title: 'Shadow Monarch', description: 'Reach level 200', icon: '🌑', rarity: 'legendary', requirement: { type: 'level', value: 200 } },
                        { title: 'Eternal Flame', description: 'Maintain 100-day streak', icon: '🔥', rarity: 'legendary', requirement: { type: 'streak', value: 100 } },
                        { title: 'Legend', description: 'Complete 500 quests', icon: '🏆', rarity: 'legendary', requirement: { type: 'total_quests', value: 500 } },
                    ];
                    _a = 0, achievements_1 = achievements;
                    _b.label = 10;
                case 10:
                    if (!(_a < achievements_1.length)) return [3 /*break*/, 13];
                    achievement = achievements_1[_a];
                    return [4 /*yield*/, prisma.achievement.create({ data: achievement })];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12:
                    _a++;
                    return [3 /*break*/, 10];
                case 13:
                    console.log("\u2705 Created ".concat(achievements.length, " achievements"));
                    console.log('🎉 Seeding completed!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
