import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RepositoryService } from 'src/Repository/repository.service';

@Injectable()
export class AdminService {
    constructor(private repository: RepositoryService){}

    async getAllTransactions(userInfo:IUser){
      try {
        const{isAdmin}= userInfo
        if(!isAdmin) throw new UnauthorizedException()
         return await this.repository.transaction.findMany()
      } catch (error) {
        throw new Error(error.message);
      }
    }

    async getAllPendingTransactions(userInfo:IUser){
        try {
            const{isAdmin}= userInfo
            if(!isAdmin) throw new UnauthorizedException()    
            return await this.repository.transaction.findMany({
        where:{
            status:"PENDING"
        }}
        )
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getAllApprovedTransactions(userInfo:IUser){
        try {
            const{isAdmin}= userInfo
            if(!isAdmin) throw new UnauthorizedException()    
            return await this.repository.transaction.findMany({
        where:{
            status:"APPROVED"
        }}
        )
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async approveTransaction(txnId:string,userInfo:IUser){
        try {
            const{isAdmin}= userInfo
            if(!isAdmin) throw new UnauthorizedException()
            return await this.repository.transaction.update({
          where:{
            id:txnId
          },
          data:{
            status:"APPROVED"
          }
        })    
        } catch (error) {
            
        }
    }
}
