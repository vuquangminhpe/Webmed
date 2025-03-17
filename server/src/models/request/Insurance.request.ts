export interface PurchaseInsuranceReqBody {
  insurance_id: string
  payment_method: 'cash' | 'card'
}
