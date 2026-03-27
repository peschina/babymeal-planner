import { buildApp } from './app.js';
import { loadConfig } from './config.js';
import { loadCereals, loadProteins, loadVegetables, loadRules } from './services/dataLoader.js';
import { generatePlan } from './services/planGenerator.js';

const config = loadConfig();

const [cereals, proteins, vegetables, rules] = await Promise.all([
  loadCereals(),
  loadProteins(),
  loadVegetables(),
  loadRules(),
]);

const plan = generatePlan({ cereals, proteins, vegetables, rules });
const app = await buildApp({ plan });

try {
  await app.listen({ port: config.apiPort, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
