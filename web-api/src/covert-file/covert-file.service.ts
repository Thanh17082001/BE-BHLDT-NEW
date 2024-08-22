var htmlToRtf = require('html-to-rtf');

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
@Injectable()
export class CovertFileService {

  async convertDocxToRtf(docxFilePath: string, outputFilePath: string): Promise<string> {
    const outputFilePath2 = path.join(outputFilePath, path.basename(docxFilePath, path.extname(docxFilePath)) + '.rtf');
     const startIndex = outputFilePath2.lastIndexOf('\\rtf\\');
    const docxPath = outputFilePath2.substring(startIndex);
    return new Promise((resolve, reject) => {
      exec(`soffice --headless --convert-to rtf ${docxFilePath} --outdir ${outputFilePath}`, (error, stdout, stderr) => {
        if (error) {
          console.error('Error converting DOCX to RTF:', error);
          reject(error);
        } else {
          //delete file word
           fs.unlinkSync(docxFilePath);
          resolve(docxPath.replace(/\\/g, '/')); 
        }
      });
    });
  }

  async convertDocxToRtfByLibreOffice(docxFilePath: string, outputFilePath: string): Promise<string> {
     
      const outputFilePath2 = path.join(outputFilePath, path.basename(docxFilePath, path.extname(docxFilePath)) + '.rtf');
     const startIndex = outputFilePath2.lastIndexOf('\\rtf\\');
    const docxPath = outputFilePath2.substring(startIndex);
    // const fileName = path.basename(inputFilePath, path.extname(inputFilePath));
    // const outputFilePath = path.join(outputDir, `${fileName}.rtf`);

    // Đường dẫn đầy đủ đến LibreOffice trên Windows
    const libreOfficePath = '"C:\\Program Files\\LibreOffice\\program\\soffice.exe"';

    // Lệnh để chuyển đổi DOCX sang RTF bằng LibreOffice
    const command = `${libreOfficePath} --headless --convert-to rtf ${docxFilePath} --outdir ${outputFilePath}`;
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error converting file: ${stderr}`);
        } else {
           fs.unlinkSync(docxFilePath);
          resolve(docxPath.replace(/\\/g, '/')); 
        }
      });
    });
  }

  async convertRtfToDocx(rtfFilePath: string, outputFilePath: string): Promise<string> {
    const outputFilePath2 = path.join(outputFilePath, path.basename(rtfFilePath, path.extname(rtfFilePath)) + '.docx');
     const startIndex = outputFilePath2.lastIndexOf('\\word\\');
    const rtfPath = outputFilePath2.substring(startIndex);

     const libreOfficePath = '"C:\\Program Files\\LibreOffice\\program\\soffice.exe"';
    return  new Promise((resolve, reject) => {
      exec(`${libreOfficePath} --headless --convert-to docx ${rtfFilePath} --outdir ${outputFilePath}`, (error, stdout, stderr) => {
        if (error) {
          console.error('Error converting DOCX to RTF:', error);
          reject(error);
        } else {
           fs.unlinkSync(rtfFilePath);
          resolve(rtfPath.replace(/\\/g, '/')); 
        }
      });
    });
  }
  

  

  
}
