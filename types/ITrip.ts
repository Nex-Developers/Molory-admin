export interface ITrip{
    id: number,
    seats: number,
    remainingSeats: number,
    status: number,
    departureDate: string,
    departureTime: string,
    user: {
            id: number,
            firstName: string,
            lastName: string,
            phoneNumber: string
    },
    vehicle: {
            id: number,
            type: string,
            color: string,
            numberPlate: string,
            registrationDoc: string
    },
    routes: {
            id: number,
            distance: number,
            duration: number,
            price: number,
            stops: any,
            // travels: string
    },
    createdAt: string
}