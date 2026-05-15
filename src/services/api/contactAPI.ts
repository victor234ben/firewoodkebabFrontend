import client from './client';
import type { ContactInquiryDTO, QuoteInquiryDTO } from '@/types';

export const contactAPI = {
  sendContact: (data: ContactInquiryDTO) => client.post('/contacts', data),
  sendQuote:   (data: QuoteInquiryDTO)   => client.post('/contacts/quote',   data),
};