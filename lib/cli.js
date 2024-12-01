const fs = require('fs')

const { Diff } = require('./index')

module.exports = function (argv) {
  const options = require('dreamopt')(
    [
      'Usage: footgun-diff leftFile.json rightFile.json',
      '  <leftFile.json>              Left side file #var(leftFile) #required',
      '  <rightFile.json>             Right side file #var(rightFile) #required',
      'General options:',
      '  -v, --verbose           Output info on each step',
    ],
    argv
  )
  if (options.verbose) {
    process.stderr.write(`${JSON.stringify(options, null, 2)}\n`)
  }
  const leftData = fs.readFileSync(options.leftFile, 'utf8')
  if (options.verbose) {
    process.stderr.write('Loading left file...\n')
  }
  const rightData = fs.readFileSync(options.rightFile, 'utf8')
  if (options.verbose) {
    process.stderr.write('Loading right file...\n')
  }
  if (options.verbose) {
    process.stderr.write('Parsing left file...\n')
  }
  const left = JSON.parse(leftData)
  if (options.verbose) {
    process.stderr.write('Parsing right file...\n')
  }
  const right = JSON.parse(rightData)
  if (options.verbose) {
    process.stderr.write('Diff...\n')
  }
  const result = Diff.jsToDiffLines(left, right)
  if (result.length > 0) {
    result.push('');
    process.stdout.write(result.join('\n'));
    process.exit(1)
  } else {
    if (options.verbose) {
      process.stderr.write('No diff')
    }
    process.exit(0)
  }
}
