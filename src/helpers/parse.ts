import axios from "axios";
import xml from "xml2js";

const parseBuyer = (buyer: any) => {
  const { Ten, MST, DChi, HTTToan, SHDNNuoc, TNgay, DNgay, SHDong } = buyer;
  return {
    name: Ten[0],
    tax_code: MST[0],
    payment_method: HTTToan[0],
    address: DChi[0],
    start_date: new Date(TNgay[0]),
    end_date: new Date(DNgay[0]),
    contract_id: SHDong[0],
  };
};

const parseSeller = (seller: any) => {
  const { NBTen, NBMST, NBDChi, NBDThoai } = seller;
  return {
    name: NBTen[0],
    tax_code: NBMST[0],
    address: NBDChi[0],
    tel: NBDThoai[0],
  };
};

const parseInvoice = (Invoice: any) => {
  const { MSHDon, KHHDon, SHDon, THDon, TDLap, DVTTe, TGia, IDHDon, TTCKhac } = Invoice;
  return {
    form_number: MSHDon[0],
    symbol: KHHDon[0],
    serial: parseInt(SHDon[0]),
    name: THDon[0],
    created_at: new Date(TDLap[0]),
    currency: DVTTe[0],
    exchange_rate: parseInt(TGia[0]),
    full_serial: IDHDon[0],
  };
};

const parsePayment = (rawPayment: any) => {
  const { TgTCThue, TSGTGTang, TgTThue, TgTTTBSo, TgTTTBChu } = rawPayment;
  return {
    Total_amount_without_tax: TgTCThue[0],
    total_value_added: parseInt(TSGTGTang[0]),
    total_tax: parseInt(TgTThue[0]),
    Total_payment_in_numbers: TgTTTBSo[0],
    Total_payment_in_words: TgTTTBChu[0],
  };
};

const parseServices = (rawGoodsService: any) => {
  return rawGoodsService.HHDVu.map((HHDVu: any) => {
    const { STT, THHDVu, TTien, TSuat, TGTGTang, TCong } = HHDVu;
    return {
      numerical_order: parseInt(STT),
      name: THHDVu[0],
      money: parseInt(TTien[0]),
      vat_rate: parseInt(TSuat[0]),
      vat_amount: parseInt(TGTGTang[0]),
      total_money: TCong[0],
    };
  });
};

export const parseXml = async (attachmentUrl: any) => {
  const res = await axios.get(attachmentUrl);

  const parser = new xml.Parser();
  const jsonParser = await parser.parseStringPromise(res.data);

  const invoice = parseInvoice(jsonParser.HDon.DLHDon[0].TTChung[0]);
  const buyer = parseBuyer(jsonParser.HDon.DLHDon[0].NDHDon[0].NMua[0]);
  const seller = parseSeller(jsonParser.HDon.DLHDon[0].NDHDon[0].Nban[0]);
  const services = parseServices(jsonParser.HDon.DLHDon[0].NDHDon[0].DSHHDVu[0]);
  const payment = parsePayment(jsonParser.HDon.DLHDon[0].NDHDon[0].TToan[0]);

  return {
    invoice,
    buyer,
    seller,
    services,
    payment,
  };
};
