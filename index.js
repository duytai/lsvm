#!/usr/bin/env node

const { PCToSource } = require('solidity-helpers')
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const contract = process.argv[2]
let pc = process.argv[3]

if (contract && pc) {
  pc = parseInt(pc)
  const source = path.join(shell.pwd().stdout, contract)
  const json = path.join(shell.pwd().stdout, contract + '.json')
  const txt = fs.readFileSync(source, 'utf8')
  const map = JSON.parse(fs.readFileSync(json, 'utf8'))
  const name = contract.split('/').slice(-1)[0].split('.')[0]
  const key = Object.keys(map.contracts).find(k => k.endsWith(`:${name}`))
  const {
    contracts: {
      [key]: {
        bin,
        'bin-runtime': binRuntime,
        'srcmap-runtime': srcmapRuntime,
        srcmap,
        asm,
      },
    },
  } = map
  try {
    const pcToSource1 = new PCToSource({
      bin: binRuntime,
      srcmap: srcmapRuntime,
      txt,
    })
    console.log('=====runtime=====')
    console.log(
      pcToSource1.toSource(pc)
    )
  } catch(e) {}
  try {
    const pcToSource2 = new PCToSource({
      bin,
      srcmap,
      txt,
    })
    console.log('=====deploy=====')
    console.log(
      pcToSource2.toSource(pc)
    )
  } catch(e) {}
}
