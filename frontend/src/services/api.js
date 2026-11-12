const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
).replace(/\/+$/, '');

function jsonRequest(method, payload) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}

async function request(path, options = {}) {
  const url = `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
  let res;
  try {
    res = await fetch(url, options);
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Network request failed.';
    throw new Error(`Could not reach the backend at ${API_BASE_URL}: ${reason}`);
  }

  const responseText = await res.text();
  let data = null;
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!res.ok) {
    const detail = data && typeof data === 'object' ? data.detail : data;
    const message = typeof detail === 'string'
      ? detail
      : detail
        ? JSON.stringify(detail)
        : res.statusText;
    throw new Error(message || `HTTP ${res.status}`);
  }
  return data;
}

export const jobsApi = {
  create: (payload) =>
    request('/jobs/', jsonRequest('POST', {
      title: payload.title,
      description: payload.description,
      required_skills: payload.required_skills,
      minimum_experience_years: Number(payload.minimum_experience_years),
    })),

  list: () => request('/jobs/'),
};

export const candidatesApi = {
  uploadResume: (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('/candidates/upload-resume', { method: 'POST', body: form });
  },

  create: (payload) =>
    request('/candidates/', jsonRequest('POST', payload)),

  list: () => request('/candidates/'),

  updateStatus: (id, status) =>
    request(`/candidates/${encodeURIComponent(id)}/status`, jsonRequest('PATCH', { status })),
};

export const matchingApi = {
  evaluate: (payload) =>
    request('/matching/', jsonRequest('POST', payload)),
};

export const interviewsApi = {
  generateQuestions: (payload) =>
    request('/interviews/generate-questions', jsonRequest('POST', payload)),

  notify: (payload) =>
    request('/interviews/notify', jsonRequest('POST', payload)),
};
