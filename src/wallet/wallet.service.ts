import { ConflictException, Injectable } from '@nestjs/common';
import { RepositoryService } from 'src/Repository/repository.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class WalletService {
    constructor(private repositoryService: RepositoryService){}

    async createWallet(user:IUser){
        try {
            const{id,isAdmin}=user
            if(isAdmin){
             throw new ConflictException("Admin cannot create wallet")
            }else{
             
    
    
    
    
    
    
            }
        } catch (error) {
            
        }
       
    }
}
