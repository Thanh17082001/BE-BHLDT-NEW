// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { UserService } from 'src/user/user.service'; // Import your UserService
// import * as jwt from 'jsonwebtoken';
// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   constructor(private userService: UserService) { }

//   async use(req: Request, res: Response, next: NextFunction) {
//     const authHeader = req.headers.authorization;

//     // if (!authHeader) {
//     //   return res.status(401).json({ message: 'No token provided' });
//     // }

//     const token = authHeader.split(' ')[1];

//     try {
//       // Decode JWT and get user ID
//       const decoded: any = jwt.verify(token, 'your_jwt_secret');
//       const userId = decoded.id; // Assuming token contains user ID
//       console.log('check id', userId);

//       // Fetch user details using UserService
//       const user = await this.userService.findOne(userId);
//       req.user = user;
//     } catch (err) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }

//     next();
//   }
// }