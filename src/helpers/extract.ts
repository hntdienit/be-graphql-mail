import base64url from "base64url";

export const extractHeader = (headers: any) => {
  let from = null;
  let to = null;
  let subject = null;
  let date = null;

  for (const header of headers) {
    const { name, value } = header;
    if (name === "To") {
      to = value;
    } else if (name === "From") {
      const pattern = /<([^>]+)>/;

      const match = value.match(pattern);
      from = match[1];
    } else if (name === "Date") {
      date = new Date(value);
    } else if (name === "Subject") {
      subject = value;
    }

    if (from && to && subject && date) {
      break;
    }
  }

  return {
    from,
    to,
    subject,
    date,
  };
};

export const extractBody = (parts: any) => {
  let content = null;
  let attachments: any[] = [];

  for (const part of parts) {
    const { body, filename } = part;
    let htmlPriority = false;
    let tempContent = null;

    if (part.parts) {
      part.parts.forEach((part: any) => {
        const { mimeType } = part;
        if (mimeType === "text/plain") {
          // TODO: decode data
          content = base64url.decode(part.body.data);
        } else if (mimeType === "text/html") {
          htmlPriority = true;
          tempContent = base64url.decode(part.body.data);
        }
      });
    } else {
      const { mimeType } = part;

      if (mimeType === "text/plain") {
        content = base64url.decode(part.body.data);
      } else if (mimeType === "text/html") {
        htmlPriority = true;
        tempContent = base64url.decode(part.body.data);
      }
    }

    if (filename) {
      attachments.push({
        id: body.attachmentId,
        filename,
      });
    }

    if (htmlPriority) {
      content = tempContent;
    }
  }

  return {
    content,
    attachments,
  };
};
