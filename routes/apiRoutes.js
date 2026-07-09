const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const { protectAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const authCtrl = require('../controllers/authController');
const productCtrl = require('../controllers/productController');
const offerCtrl = require('../controllers/offerController');
const settingCtrl = require('../controllers/settingController');

// --- Public Endpoints ---
router.get('/products', productCtrl.getProducts);
router.get('/products/:id', productCtrl.getProductById);
router.get('/categories', productCtrl.getCategories);
router.get('/offers', offerCtrl.getOffers);
router.get('/settings', settingCtrl.getSettings);
router.post('/order-log', productCtrl.logOrder);

// --- Authentication Endpoints ---
router.post('/admin/login', authCtrl.login);
router.get('/admin/me', protectAdmin, authCtrl.verifySession);
router.post('/admin/logout', authCtrl.logout);

// --- Protected Admin Content Control Endpoints ---
router.post('/products', protectAdmin, productCtrl.createProduct);
router.put('/products/:id', protectAdmin, productCtrl.updateProduct);
router.delete('/products/:id', protectAdmin, productCtrl.deleteProduct);

router.post('/offers', protectAdmin, offerCtrl.createOffer);
router.put('/offers/:id', protectAdmin, offerCtrl.updateOffer);
router.delete('/offers/:id', protectAdmin, offerCtrl.deleteOffer);

router.put('/settings', protectAdmin, settingCtrl.updateSettings);

// --- Local Engine Image Storage Passthrough Endpoint ---
// routes/apiRoutes.js ke andar /upload route ko isse update karein:

router.post('/upload', protectAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      // Contract matching error structure if file is missing
      return res.status(400).json({ 
        success: false, 
        error: { message: "No source asset delivered" } 
      });
    }

    // 1. Buffer ko instant Base64 string me badlein
    const base64Image = req.file.buffer.toString('base64');

    // 2. ImgBB standard target format parameters bundle karein
    const payload = new URLSearchParams();
    payload.append('image', base64Image);

    // 3. ImgBB API call dispatch karein
    const imgbbResponse = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      payload,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    const secureUrl = imgbbResponse.data.data.url;
    
    // CRITICAL FIX: Frontend contract v2 ke hisab se success object ko "data" me wrap karein!
    return res.json({ 
      success: true,
      data: {
        url: secureUrl, 
        type: "image" 
      }
    });

  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.message;
    console.error('Core Upload Error Log:', errMsg);

    // Strict contract matching error envelope format
    return res.status(500).json({ 
      success: false, 
      error: { message: `Storage Upload Failed: ${errMsg}` } 
    });
  }
});

module.exports = router;