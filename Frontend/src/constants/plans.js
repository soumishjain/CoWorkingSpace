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
      videoCall: false,
      analytics: false,
      chatbot: false,
      fileUpload: false,
      replyMessage: false,
      mentions: false,
      editMessage: false,
      deleteMessage: false
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
      videoCall: false,
      analytics: false,
      chatbot: false,
      fileUpload: true,
      replyMessage: true,
      mentions: false,
      editMessage: true,
      deleteMessage: true
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
      videoCall: true,
      analytics: true,
      chatbot: false,
      fileUpload: true,
      replyMessage: true,
      mentions: false,
      editMessage: true,
      deleteMessage: true
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
      videoCall: true,
      analytics: true,
      chatbot: true,
      fileUpload: true,
      replyMessage: true,
      mentions: true,
      editMessage: true,
      deleteMessage: true
    }
  }
};