"""Verify decoded real Session evidence; never creates receipts or tool results."""
import hashlib
import json
import sys
from pathlib import Path

root, sample, output = map(Path, sys.argv[1:4])
checks = []

def check(name, condition):
    assert condition, name
    checks.append(name)

sessions = []
for file in sorted(root.glob('final-session-*.decoded.json')):
    events = json.loads(file.read_text())
    sources = [event for event in events if event.get('type') == 'user/message']
    receipts = [event for event in sources if event['data'].get('source', {}).get('kind') == 'pto-artifact-analysis']
    if not receipts:
        continue
    sid = events[0]['id']
    skill_sources = [event for event in sources if event['data'].get('source', {}).get('kind') == 'skill-invocation']
    check(sid + ': one receipt source', len(receipts) == 1)
    check(sid + ': one Skill source', len(skill_sources) == 1)
    receipt = receipts[0]['data']['source']['receipt']
    check(sid + ': exact Session binding', receipt['sessionId'] == sid)
    check(sid + ': official Skill pin', receipt['skill'] == dict(name='dependency-redundancy', provider='pypto-official-af1d7a016ce5', revision='af1d7a016ce50ba109c4b4224580a6b758bde7da'))
    check(sid + ': tool pin', receipt['tool'] == dict(name='pto_dependency_redundancy', revision='77fa0171c24a4e1c323fb29a6a86239df93edb58'))
    check(sid + ': artifact reference', receipt['artifactRefs'] == ['deps.json'])
    tool_results = []
    for event in events:
        if event.get('type') != 'tool/result':
            continue
        for block in event['data']['message']['content']:
            if block['type'] != 'tool-result':
                continue
            check(sid + ': tool result success', not block.get('isError', False))
            for content in block['content']:
                if content['type'] == 'text':
                    tool_results.append(json.loads(content['text']))
    check(sid + ': one real tool result', len(tool_results) == 1)
    result = tool_results[0]
    check(sid + ': tool receipt equals injected receipt', result['receipt'] == receipt)
    check(sid + ': both real modes', [mode['mode'] for mode in result['modes']] == ['reduced', 'reduced_dataflow'])
    for mode in result['modes']:
        check(sid + ': ' + mode['mode'] + ' expected reduction', 'removed 1 redundant edge(s) of 1222 (1221 kept)' in mode['headline'])
        check(sid + ': ' + mode['mode'] + ' no tool stderr', mode['stderr'] == '')
        check(sid + ': ' + mode['mode'] + ' real output exists', Path(mode['outputRef']).is_file())
    first_context = next(event['seq'] for event in events if event.get('type') == 'request/context')
    check(sid + ': receipt and Skill precede model context', receipts[0]['seq'] < first_context and skill_sources[0]['seq'] < first_context)
    attachments = [block['attachment'] for event in sources if event['data'].get('source', {}).get('kind') == 'user' for block in event['data']['content'] if block['type'] == 'file']
    ends = [event['data']['reason']['kind'] for event in events if event.get('type') == 'turn/end']
    sessions.append(dict(sessionId=sid, receipt=receipt, receiptSources=1, skillSources=1, turnEnds=ends, attachments=attachments, toolResult=result))
check('two analysis Sessions', len(sessions) == 2)
check('new launch has distinct request', len({s['receipt']['requestId'] for s in sessions}) == 2)
check('same captured inventory revision', len({s['receipt']['recordRevision'] for s in sessions}) == 1)
retry = next(s for s in sessions if s['turnEnds'] == ['error', 'completed'])
check('retry has exactly one durable file', len(retry['attachments']) == 1)
attachment = retry['attachments'][0]
data = (root / 'workspace/p5-attachment.txt').read_bytes()
digest = hashlib.sha256(data).hexdigest()
check('uploaded identity matches original file', attachment == dict(attachmentId='sha256:' + digest, name='p5-attachment.txt', bytes=len(data)))
check('uploaded content retained in durable store', (root / 'final/attachments/v1/file-objects' / digest[:2] / digest).read_bytes() == data)
check('new launch completes in one turn', any(s['turnEnds'] == ['completed'] for s in sessions))
input_sha = hashlib.sha256(sample.read_bytes()).hexdigest()
check('original input unchanged', input_sha == '97ee1e49bf14d9c8dfa69ef1464c0d551bc535dfa9615609c68d5526dd383a4b')
report = dict(checkCount=len(checks), checks=checks, inputSHA256=input_sha, sessions=sessions)
output.write_text(json.dumps(report, ensure_ascii=False, indent=2).replace(str(root), '<fixture-root>') + '\n')
print(json.dumps(dict(passed=len(checks), sessions=[s['sessionId'] for s in sessions], inputSHA256=input_sha)))
