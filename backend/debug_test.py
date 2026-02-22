import urllib.request, json, time, sys

BASE = 'http://localhost:8001'

def req(method, path, body=None):
    url = BASE + path
    data = json.dumps(body).encode() if body else None
    r = urllib.request.Request(url, data=data, method=method, headers={'Content-Type': 'application/json', 'User-Agent': 'QA'})
    try:
        res = urllib.request.urlopen(r, timeout=10)
        return json.loads(res.read()), None
    except urllib.error.HTTPError as e:
        return None, 'HTTP {}: {}'.format(e.code, e.read().decode()[:300])
    except Exception as e:
        return None, str(e)

# Get models
models, merr = req('GET', '/api/models')
print('Models:', len(models) if models else merr)
model = models[0] if models else {'model_id': 'distilbert-base', 'task': 'NLP'}

# Predict  
pdata, perr = req('GET', '/api/predict?model_id={}&compute_target=gpu&precision=FP32'.format(model['model_id']))
print('Predict:', pdata if pdata else perr)

# Start a run
body = {'model': model['model_id'], 'task': model.get('task','NLP'), 'precision': 'FP32', 'compute_target': 'gpu', 'batch_size': 1, 'num_samples': 5}
run_start, err = req('POST', '/api/run', body)
print('Start Run:', run_start if run_start else err)
run_id = run_start.get('run_id') if run_start else None

if run_id:
    for i in range(25):
        time.sleep(1)
        rdata, rerr = req('GET', '/api/run/{}'.format(run_id))
        status = rdata.get('status') if rdata else rerr
        print('Poll {}: {}'.format(i+1, status))
        if status in ('complete', 'failed'):
            break
    
    odata, oerr = req('GET', '/api/run/{}/optimize'.format(run_id))
    print('Optimize:', odata if odata else oerr)
else:
    print('Skipping run test - failed to start')
