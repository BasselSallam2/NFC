const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");

dotenv.config();

class BusinessCard {
  constructor() {
    this.keyFilePath =
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      "./zaghamwallet-fd3e35834da0.json";
    this.auth();
  }

  auth() {
    const auth = new google.auth.GoogleAuth({
      keyFile: this.keyFilePath,
      scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
    });

    this.credentials = require(this.keyFilePath);

    this.client = google.walletobjects({
      version: "v1",
      auth: auth,
    });
  }

 async createJwtNewObjects(issuerId, classSuffix, objectSuffix) {

    let response;


    try {
      response = await this.client.genericclass.get({
        resourceId: `${issuerId}.${classSuffix}`,
      });

      console.log(`Class ${issuerId}.${classSuffix} already exists!`);

      return `${issuerId}.${classSuffix}`;
    } catch (err) {
      if (err.response && err.response.status !== 404) {
    
        console.log(err);
        return `${issuerId}.${classSuffix}`;
      }
    }

    let newClass = {
    id: `${issuerId}.${classSuffix}`,
  };

  let newObject = {
    id: `${issuerId}.${objectSuffix}`,
    classId: `${issuerId}.${classSuffix}`,
    state: "ACTIVE",


    heroImage: {
      sourceUri: {
        uri: "https://marketplace.canva.com/EAGLrR2e2H8/1/0/1600w/canva-blue-modern-business-card-PSng3mW2xTM.jpg",
      },
      contentDescription: {
        defaultValue: {
          language: "en-US",
          value: "Business card cover",
        },
      },
    },


    textModulesData: [
      {
        header: "Name",
        body: "Bassel Sallam",
        id: "NAME_MODULE",
      },
      {
        header: "Email",
        body: "bassel@zagham.com",
        id: "EMAIL_MODULE",
      },
      {
        header: "Phone",
        body: "01100725449",
        id: "PHONE_MODULE",
      },
      {
        header: "Address",
        body: "31 st. Abbas El Aad",
        id: "ADDRESS_MODULE",
      },
    ],

    linksModuleData: {
      uris: [
        {
          uri: "https://www.linkedin.com/in/basselsallam/",
          description: "LinkedIn Profile",
          id: "LINKEDIN_LINK",
        },
        {
          uri: "tel:01100725449",
          description: "Call Bassel",
          id: "PHONE_LINK",
        },
        {
          uri: "mailto:bassel@zagham.com",
          description: "Send Email",
          id: "EMAIL_LINK",
        },
      ],
    },


    imageModulesData: [
      {
        mainImage: {
          sourceUri: {
            uri: "https://www.logoai.com/uploads/output/2025/09/10/3cf3d874b0fc6cff3e8ac2a439838512.jpg",
          },
          contentDescription: {
            defaultValue: {
              language: "en-US",
              value: "Company Logo",
            },
          },
        },
        id: "LOGO_IMAGE_MODULE",
      },
    ],


    barcode: {
      type: "QR_CODE",
      value: "https://www.linkedin.com/in/basselsallam/",
    },

    cardTitle: {
      defaultValue: {
        language: "en-US",
        value: "Business Card",
      },
    },

    header: {
      defaultValue: {
        language: "en-US",
        value: "Bassel Sallam",
      },
    },

    hexBackgroundColor: "#0D3558",

    logo: {
      sourceUri: {
        uri: "https://www.logoai.com/uploads/output/2025/09/10/3cf3d874b0fc6cff3e8ac2a439838512.jpg",
      },
      contentDescription: {
        defaultValue: {
          language: "en-US",
          value: "Logo",
        },
      },
    },
  };

    let claims = {
      iss: this.credentials.client_email,
      aud: "google",
      origins: ["http://localhost:3000"],
      typ: "savetowallet",
      payload: {
        genericClasses: [newClass],
        genericObjects: [newObject],
      },
    };

    let token = jwt.sign(claims, this.credentials.private_key, {
      algorithm: "RS256",
    });

    console.log("Add to Google Wallet link");
    console.log(`https://pay.google.com/gp/v/save/${token}`);

    return `https://pay.google.com/gp/v/save/${token}`;
  }
}

module.exports = {BusinessCard};
