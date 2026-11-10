import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const BACKEND_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASELINE_FILE = join(BACKEND_DIR, 'tests', 'baseline.json')
const KEY_SEPARATOR = ' > '

const parseArguments = (args) => {
  const check = args.includes('--check')
  const drops = args.flatMap((arg, index) => arg === '--drop' ? [args[index + 1]] : [])
  if (drops.some(drop => !drop)) fail('--drop needs a test key: --drop "<file> > <describe> > <test>"')
  if (check && drops.length > 0) fail('--drop only works without --check')
  return { check, drops }
}

const fail = (message, keys = []) => {
  console.error(`\n✖ ${message}`)
  for (const key of keys) console.error(`  - ${key}`)
  process.exit(1)
}

const runSuite = () => {
  const outputFile = join(mkdtempSync(join(tmpdir(), 'test-baseline-')), 'results.json')
  spawnSync('npx', ['vitest', 'run', '--reporter=default', '--reporter=json', `--outputFile.json=${outputFile}`], {
    cwd: BACKEND_DIR,
    stdio: 'inherit'
  })
  if (!existsSync(outputFile)) fail('Vitest wrote no results: the suite did not run')
  return JSON.parse(readFileSync(outputFile, 'utf8'))
}

const keyOf = (file, test) => [relative(BACKEND_DIR, file), ...test.ancestorTitles, test.title].join(KEY_SEPARATOR)

const collectResults = (results) => {
  const all = []
  const passing = new Set()
  for (const file of results.testResults) {
    for (const test of file.assertionResults) {
      const key = keyOf(file.name, test)
      all.push(key)
      if (test.status === 'passed') passing.add(key)
    }
  }
  const duplicates = all.filter((key, index) => all.indexOf(key) !== index)
  if (duplicates.length > 0) fail('Test names must be unique within a file:', [...new Set(duplicates)])
  return { existing: new Set(all), passing }
}

const readBaseline = () => existsSync(BASELINE_FILE) ? JSON.parse(readFileSync(BASELINE_FILE, 'utf8')) : []

const writeBaseline = (keys) => writeFileSync(BASELINE_FILE, JSON.stringify([...keys].sort(), null, 2) + '\n')

const validateDrops = (drops, baseline, passing) => {
  const notInBaseline = drops.filter(drop => !baseline.includes(drop))
  if (notInBaseline.length > 0) fail('Not in the baseline, nothing to drop:', notInBaseline)
  const stillPassing = drops.filter(drop => passing.has(drop))
  if (stillPassing.length > 0) fail('Still passing, so it stays in the baseline:', stillPassing)
}

const describeRegression = (key, existing) => existing.has(key) ? `${key}  (fails)` : `${key}  (missing: renamed or deleted?)`

const main = () => {
  const { check, drops } = parseArguments(process.argv.slice(2))
  const baseline = readBaseline()
  const { existing, passing } = collectResults(runSuite())
  validateDrops(drops, baseline, passing)

  const kept = baseline.filter(key => !drops.includes(key))
  const regressions = kept.filter(key => !passing.has(key)).map(key => describeRegression(key, existing))
  const newPasses = [...passing].filter(key => !kept.includes(key)).sort()

  if (regressions.length > 0) {
    fail('Regressions: tests in the baseline that no longer pass. Fix them, or drop one with --drop "<key>":', regressions)
  }
  if (check && newPasses.length > 0) {
    fail('New passing tests not in the baseline. Run "npm run test:baseline" and commit tests/baseline.json:', newPasses)
  }
  if (!check) writeBaseline([...kept, ...newPasses])

  console.log(`\n✔ Baseline: ${kept.length + (check ? 0 : newPasses.length)} passing tests` +
    (check ? '' : `, ${newPasses.length} added, ${drops.length} dropped`))
}

main()
