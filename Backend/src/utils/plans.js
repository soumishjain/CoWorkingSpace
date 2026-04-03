export const PLANS = {
  individual: {
    id: "individual",
    name: "Individual",
    price: 0,

    limits: {
      members: 10,
      departments: 1,
      chatroomsPerDepartment: 1
    },

    features: {
      // existing
      videoCall: false,
      analytics: false,
      chatbot: false,

      // 🔥 NEW (chat features)
      fileUpload: false,
      replyMessage: false,
      mentions: false
    }
  },

  startup: {
    id: "startup",
    name: "Startup",
    price: 499,

    limits: {
      members: 50,
      departments: 3,
      chatroomsPerDepartment: 3
    },

    features: {
      // existing
      videoCall: false,
      analytics: false,
      chatbot: false,

      // 🔥 NEW
      fileUpload: true,
      replyMessage: true,
      mentions: false
    }
  },

  company: {
    id: "company",
    name: "Company",
    price: 1999,

    limits: {
      members: 200,
      departments: 10,
      chatroomsPerDepartment: 10
    },

    features: {
      // existing
      videoCall: true,
      analytics: true,
      chatbot: false,

      // 🔥 NEW
      fileUpload: false,
      replyMessage: true,
      mentions: false
    }
  },

  bigtech: {
    id: "bigtech",
    name: "Big Tech",
    price: 4999,

    limits: {
      members: 1000,
      departments: 50,
      chatroomsPerDepartment: 20
    },

    features: {
      // existing
      videoCall: true,
      analytics: true,
      chatbot: true,

      // 🔥 NEW
      fileUpload: true,
      replyMessage: true,
      mentions: true
    }
  }
};