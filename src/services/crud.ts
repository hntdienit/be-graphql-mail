import { v4 as uuidv4 } from "uuid";
import { hasuraAPI } from "../libs/request";
import { getMail } from "../libs/mail";
import { extractHeader, extractBody } from "@helpers/extract";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebase } from "../libs/firebase";
import base64url from "base64url";

export const getUser = async (email: any) => {
  const query = `
  query MyQuery {
    users(where: {email: {_eq: "${email}"}}) {
      id
    }
  }`;

  const response = await hasuraAPI.post("", {
    query,
  });

  const foundUser = response.data.data.users[0];
  if (!foundUser) {
    return {
      user: null,
    };
  }

  return {
    user: foundUser,
  };
};

export const getAllMessagesUnRead = async () => {
  const gmail = await getMail();

  const response = await gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX", "UNREAD"],
  });

  const { messages } = response.data;

  return messages;
};

export const getMessagesDetail = async (messages: any[]) => {
  const gmail = await getMail();

  const messagesDetail: any[] = await Promise.all(
    messages.map(async (i) => {
      const response = await gmail.users.messages.get({
        userId: "me",
        id: i.id,
      });

      const { payload } = response.data;
      const { from, to, subject, date } = extractHeader(response.data.payload?.headers);
      let tempContent = response.data.payload?.body?.data;
      let tempAttachments = [];

      if (!!response.data.payload?.parts) {
        const { content, attachments } = extractBody(response.data.payload?.parts);

        tempContent = content;
        tempAttachments = attachments;
      }

      return {
        id: i.id,
        from,
        to,
        subject,
        date,
        content: tempContent,
        attachments: tempAttachments,
      };
    })
  );

  return messagesDetail;
};

export const getMessageAttachments = async (messageId: string, rawAttachments: any[]) => {
  const gmail = await getMail();
  const attachments: any[] = [];
  const attachmentsDetail = await Promise.all(
    rawAttachments.map(async (i: any, index: any) => {
      const attachmentDetail = await gmail.users.messages.attachments.get({
        userId: "me",
        messageId,
        id: i.id,
      });

      const content = base64url.toBuffer(String(attachmentDetail.data.data));
      attachments.push({
        id: i.id,
        filename: i.filename,
        content,
      });

      return rawAttachments;
    })
  );

  return attachments;
};

export const createMail = async (payload: any) => {
  const createEmail = `#graphql
    mutation MyMutation($object: emails_insert_input! = {}) {
      insert_emails_one(object: $object) {
        id
      }
    }
  `;

  const response = await hasuraAPI.post("", {
    query: createEmail,
    variables: {
      object: payload,
    },
  });

  return response.data.data.insert_emails_one;
};

export const createAttachment = async (emailId: string, attachments: any[]) => {
  let attachmentUrls;
  if (attachments.length !== 0) {
    const createAttachment = `#graphql
      mutation MyMutation($object: attachments_insert_input = {}) {
        insert_attachments_one(object: $object) {
          email_id
          filename
          id
          url
        }
      }
    `;

    attachmentUrls = await Promise.all(
      attachments.map(async (attachment: any) => {
        const { filename, id, content } = attachment;

        const storageRef = ref(firebase, `/files/${uuidv4()}-${filename}`);
        await uploadBytes(storageRef, content);
        const url = await getDownloadURL(storageRef);

        const attachmentPayload = {
          id: uuidv4(),
          email_id: emailId,
          filename: filename,
          url,
        };

        await hasuraAPI.post("", {
          query: createAttachment,
          variables: {
            object: attachmentPayload,
          },
        });

        return url;
      })
    );
  }

  return attachmentUrls;
};

const createPayment = async (payment: any) => {
  const mutation = `#graphql
    mutation MyMutation($object: payments_insert_input = {}) {
      insert_payments_one(object: $object) {
        id
      }
    }
  `;

  const res = await hasuraAPI.post("", {
    query: mutation,
    variables: {
      object: {
        id: uuidv4(),
        ...payment,
      },
    },
  });

  return res.data.data.insert_payments_one;
};

const createBuyer = async (buyer: any) => {
  const query = `
    query MyQuery {
      buyes(where: {tax_code: {_eq: "${buyer.tax_code}"}}) {
        id
      }
    }
  `;

  const res_query = await hasuraAPI.post("", {
    query: query,
  });

  if (res_query.data.data.buyes.length !== 0) {
    return res_query.data.data.buyes[0];
  }

  const mutation = `#graphql
    mutation MyMutation($object: buyes_insert_input = {}) {
      insert_buyes_one(object: $object) {
        id
      }
    }
  `;

  const res = await hasuraAPI.post("", {
    query: mutation,
    variables: {
      object: {
        id: uuidv4(),
        ...buyer,
      },
    },
  });

  return res.data.data.insert_buyes_one;
};

const createSeller = async (seller: any) => {
  const query = `
    query MyQuery {
      sellers(where: {tax_code: {_eq: "${seller.tax_code}"}}) {
        id
      }
    }
  `;

  const res_query = await hasuraAPI.post("", {
    query: query,
  });

  if (res_query.data.data.sellers.length !== 0) {
    return res_query.data.data.sellers[0];
  }

  const mutation = `#graphql
    mutation MyMutation($object: sellers_insert_input = {}) {
      insert_sellers_one(object: $object) {
        id
      }
    }
  `;

  const res = await hasuraAPI.post("", {
    query: mutation,
    variables: {
      object: {
        id: uuidv4(),
        ...seller,
      },
    },
  });

  return res.data.data.insert_sellers_one;
};

const createInvoice = async (invoice: any) => {
  const mutation = `#graphql
      mutation MyMutation($object: invoices_insert_input = {}) {
        insert_invoices_one(object: $object) {
          id
        }
      }
    `;

  const res = await hasuraAPI.post("", {
    query: mutation,
    variables: {
      object: {
        id: uuidv4(),
        ...invoice,
      },
    },
  });

  return res.data.data.insert_invoices_one;
};

const createServices = async (invoiceId: string, services: any[]) => {
  const mutation = `#graphql
      mutation MyMutation($object: services_insert_input = {}) {
        insert_services_one(object: $object) {
          id
        }
      }
    `;

  const res = await Promise.all(
    services.map(async (service) => {
      const payload = {
        id: uuidv4(),
        ...service,
        invoice_id: invoiceId,
      };

      const res = await hasuraAPI.post("", {
        query: mutation,
        variables: {
          object: payload,
        },
      });

      return res.data.data.insert_services_one;
    })
  );

  return res;
};

export const saveXmlData = async (emailId: string, data: any) => {
  const { invoice, seller, buyer, services, payment } = data;

  const res_buyer = await createBuyer(buyer);
  console.log("buyer: ", res_buyer);

  const res_seller = await createSeller(seller);
  console.log("seller: ", res_seller);

  const res_payment = await createPayment(payment);
  console.log("payment: ", res_payment);

  const res_invoice = await createInvoice({
    ...invoice,
    email_id: emailId,
    seller_id: res_seller.id,
    buyer_id: res_buyer.id,
    payment_id: res_payment.id,
  });
  console.log("invoice: ", res_invoice);

  const res_services = await createServices(res_invoice.id, services);
  console.log("services: ", res_services);
};
