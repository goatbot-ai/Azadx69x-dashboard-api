const meta = {
  name: "login",
  version: "1.0.0",
  description: "Login API endpoint",
  author: "Azad 💥", 
  method: "post",
  category: "examples",
  path: "/login?username=&password=" // set your desired endpoint path here
};

async function onStart({ res, req }) {
  try {
    let body;
    // Parse the request body if not already parsed.
    if (!req.body) {
      body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });
    } else {
      body = req.body;
    }

    const { username, password } = body;

    // Simple authentication logic for demonstration.
    if (username === 'azad-api-2025' && password === 'azad-api-2025') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        success: true, 
        message: 'Login successful', 
        token: 'abc123' 
      }));
    } else {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        success: false, 
        message: 'Invalid credentials' 
      }));
    }
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      success: false, 
      message: 'Internal server error', 
      error: error.message 
    }));
  }
}

module.exports = { meta, onStart };
