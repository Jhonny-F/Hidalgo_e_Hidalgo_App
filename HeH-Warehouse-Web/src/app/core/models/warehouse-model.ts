export interface WarehouseModel {
    id?: number
    fullName?: string
    identification: string
    phone: string
    email: string
    yearsOfExperience: number
    shift: 'Mañana' | 'Tarde' | 'Noche';
}