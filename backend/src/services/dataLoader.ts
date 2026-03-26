import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Cereal, Protein, Vegetable, Rules } from '../types/index.js';

const defaultDataDir = resolve(dirname(fileURLToPath(import.meta.url)), '../data');

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export async function loadCereals(dataDir = defaultDataDir): Promise<Cereal[]> {
  return readJson<Cereal[]>(resolve(dataDir, 'cereals.json'));
}

export async function loadProteins(dataDir = defaultDataDir): Promise<Protein[]> {
  return readJson<Protein[]>(resolve(dataDir, 'proteins.json'));
}

export async function loadVegetables(dataDir = defaultDataDir): Promise<Vegetable[]> {
  return readJson<Vegetable[]>(resolve(dataDir, 'vegetables.json'));
}

export async function loadRules(dataDir = defaultDataDir): Promise<Rules> {
  return readJson<Rules>(resolve(dataDir, 'rules.json'));
}
