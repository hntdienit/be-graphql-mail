import { v4 as uuidv4 } from "uuid";
import { getMail } from "../libs/mail";
import { parseXml } from "@helpers/parse";
import {
  createAttachment,
  createMail,
  getAllMessagesUnRead,
  getMessageAttachments,
  getMessagesDetail,
  getUser,
  saveXmlData,
} from "./crud";

export const getDataMail = async () => {
  const gmail = await getMail();

  const msg_list = (await getAllMessagesUnRead()) || [];
  const mails = await getMessagesDetail(msg_list);

  const messages = await Promise.all(
    mails.map(async (message: any) => {
      const { id, from, to, date, subject, content, attachments } = message;

      const { user } = await getUser(from);
      if (!user) {
        return;
      }

      const emailPayload = {
        id: uuidv4(),
        to,
        from,
        subject,
        content,
        user_id: user.id,
      };

      const res_mail = await createMail(emailPayload);

      const attachmentsDetail = await getMessageAttachments(id, attachments);

      const attachmenturl = (await createAttachment(res_mail.id, attachmentsDetail)) || [];

      attachmenturl.map(async (i) => {
        if (i.includes("xml")) {
          const parser = await parseXml(attachmenturl);
          await saveXmlData(res_mail.id, parser);
        }
      });

      // read mail
      // const a = await gmail.users.messages.modify({
      //   userId: "me",
      //   id,
      //   requestBody: {
      //     // addLabelIds: [string],
      //     removeLabelIds: ["UNREAD"],
      //   },
      // });
    })
  );

  return "Get data successfully";
};
