const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nonce = require("nonce")();
const { default: Shopify, ApiVersion } = require('@shopify/shopify-api');
const cookieParser = require("cookie-parser");


// Route Files
const auth = require('./routes/auth');
// const shopify = require("./routes/shopifyapi");

const app = express();

// Loading Env Vars
dotenv.config({ path: "./config/config.env" });

const {verifyRequest}  = require("./middleware/verify-request.js");
const {applyAuthMiddleware}  = require("./middleware/shopifyAuth");

const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST, HOST_SCHEME } = process.env;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Shopify Initialize

Shopify.Context.initialize({
  API_KEY: API_KEY,
  API_SECRET_KEY: API_SECRET_KEY,
  SCOPES: SCOPES.split(","),
  HOST_NAME: HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.January22,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(), // all supported versions are available, as well as "unstable" and "unversioned"
  });

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
app.set("use-online-tokens", USE_ONLINE_TOKENS);

app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

applyAuthMiddleware(app);

// app.get("/shopify", async (req, res) => {
//    // This shop hasn't been seen yet, go through OAuth to create a session
//   if (ACTIVE_SHOPIFY_SHOPS[SHOP] !== undefined) {
//      // not logged in, redirect to login
//     res.redirect(`/login`);
//   } else {
//     res.send("Hello world!");
//     // Load your app skeleton page with App Bridge, and do something amazing!
//     res.end();
//   }
// });
app.get('/auth/shopify', async (http_request, http_response) => {
  let authorizedRoute = await Shopify.Auth.beginAuth(
      http_request,
      http_response,
      SHOP,
      '/auth/shopify/callback',
      false,
  );
  return http_response.redirect(authorizedRoute);
});


app.get('/auth/shopify/callback', async (http_request, http_response) => {
  try {
      const client_session = await Shopify.Auth.validateAuthCallback(
          http_request,
          http_response,
          http_request.query);
      ACTIVE_SHOPIFY_SHOPS[SHOP] = client_session.scope;
      console.log(client_session.accessToken);
  } catch (eek) {
      console.error(eek);
      http_response.send('<html><body><p>${JSON.stringify(eek)}</p></body></html>')
  }
  return http_response.redirect('/auth/shopify/success');
});

app.post("/webhooks", async (req, res) => {
  try {
    await Shopify.Webhooks.Registry.process(req, res);
    console.log(`Webhook processed, returned status code 200`);
  } catch (error) {
    console.log(`Failed to process webhook: ${error}`);
    if (!res.headersSent) {
      res.status(500).send(error.message);
    }
  }
});

app.get("/products-count", verifyRequest(app), async (req, res) => {
  const session = await Shopify.Utils.loadCurrentSession(
    req,
    res,
    app.get("use-online-tokens")
  );
  const { Product } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );

  const countData = await Product.count({ session });
  res.status(200).send(countData);
});

app.post("/graphql", verifyRequest(app), async (req, res) => {
  try {
    const response = await Shopify.Utils.graphqlProxy(req, res);
    res.status(200).send(response.body);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.use(express.json());

app.use((req, res, next) => {
  const shop = req.query.shop;
  if (Shopify.Context.IS_EMBEDDED_APP && shop) {
    res.setHeader(
      "Content-Security-Policy",
      `frame-ancestors https://${shop} https://admin.shopify.com;`
    );
  } else {
    res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
  }
  next();
});

app.use("/*", (req, res, next) => {
  const { shop } = req.query;

  // Detect whether we need to reinstall the app, any request from Shopify will
  // include a shop in the query parameters.
  if (app.get("active-shopify-shops")[shop] === undefined && shop) {
    res.redirect(`/auth?${new URLSearchParams(req.query).toString()}`);
  } else {
    next();
  }
});

// ================Mount routes=====================




app.use('/api/v1/auth', auth );  
// app.use("", shopify);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Hilo Design" });
});

const forwardingAddress = "http://40a6-103-66-209-46.ngrok.io ";
const scopes = "read_products";
app.get("/shopify/product", (req, res) =>{
    const shop = req.query.shop;

    if(shop){
        const state = nonce();
        const redirectUri = forwardingAddress + "/shopify/callback";

        const installUrl = "https://" + shop + "/admin/oauth/authorize?client_id=" + API_KEY + 
            "&scope="+scopes+"&state="+state+"&redirectUri="+redirectUri;

        res.cookie("state", state);

        res.redirect(installUrl);
    }else{
        return res.status(400).send("Missing shop parameter");
    }

})


// app.get('/shopify/callback', (req, res) => {
//     const { shop, hmac, code, state } = req.query;
//     const stateCookie = cookie.parse(req.headers.cookie).state;
    
//      if (state !== stateCookie) {
//     return res.status (403).send('Request origin cannot be verified');
//      }

//     if (shop && hmac && code) {
//     // DONE: Validate request is from Shopify 
//     const map = Object.assign({}, req.query); 
//     delete map['signature']; 
//     delete map['hmac']; 
//     const message = querystring.stringify(map); 
//     const generatedHash = crypto.createHmac('sha256', apiSecret).update(message).digest('hex');
//     if (generatedHash !== hmac) {
//     return res.status (400).send('HMAC validation failed');
//     }
//     res.status (200).send('HMAC validated'); // TODO // Exchange temporary code for a permanent access token
//     // Use access token to make API call to 'shop' endpoint 
//         } else {
//     res.status (400).send('Required parameters missing');
//     }
// });


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});