import 'reflect-metadata'
import {Repository} from '../resources/repository.js'
import {runFormat} from './shared/format.js'
import {runSetPropertyInAllRepos} from './shared/set-property-in-all-repos.js'
import {runToggleArchivedRepos} from './shared/toggle-archived-repos.js'
import {runDescribeAccessChanges} from './shared/describe-access-changes.js'

import * as core from '@actions/core'

function isPublic(repository: Repository) {
  return repository.visibility === 'public'
}

async function run() {
  await runSetPropertyInAllRepos(
    'secret_scanning',
    true,
    r => isPublic(r)
  )
  await runSetPropertyInAllRepos(
    'secret_scanning_push_protection',
    true,
    r => isPublic(r)
  )
  await runToggleArchivedRepos()
  const accessChangesDescription = await runDescribeAccessChanges()
  core.setOutput(
    'comment',
    `The following access changes will be introduced as a result of applying the plan:

<details><summary>Access Changes</summary>

\`\`\`
${accessChangesDescription}
\`\`\`

</details>`
  )
  await runFormat()
}

run()
