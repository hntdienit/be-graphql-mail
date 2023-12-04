import { getMail } from "../../libs/mail";

export const Resolver = {
  Query: {
    emailList: async (parent: any, args: any, context: any, info: any) => {
      const gmail = await getMail();
      const res_list = await gmail.users.messages.list({ userId: "me", maxResults: 10 });
      return res_list.data.messages;
    },
    emailByPk: async (parent: any, args: { id: string }, context: any, info: any) => {
      const { id } = args;
      const gmail = await getMail();
      const mail = await gmail.users.messages.get({ id, userId: "me" });
      return mail.data
    },
  },
  Mutation: {
    hello: async (parent: any, args: any, context: any, info: any) => {
      return "hello";
    },
  },
};
