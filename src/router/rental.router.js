import express from 'express'
import {createRental,    getAllRentals,    getRentalById,    updateRental,    deleteRental,}  from "../controllers/rental.controller"

const router = express.Router();

router.post('/rentals', createRental);          
router.get('/rentals', getAllRentals);          
router.get('/rentals/:id', getRentalById);      
router.put('/rentals/:id', updateRental);       
router.delete('/rentals/:id', deleteRental);    

export default router