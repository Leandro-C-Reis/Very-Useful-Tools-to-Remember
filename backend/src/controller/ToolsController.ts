import { Request, Response } from 'express';
import Tool from '../models/tool';

class ToolsController {
  async index(request: Request, response: Response) {
    const result = await Tool.find();
  
    const tools = result.map((tool: any) => {
      return {
       id: tool.id,
       title: tool.title,
       link: tool.link,
       description: tool.description,
       tags: tool.tags
     }
   })
  
    return response.json(tools);
  }

  async show(request: Request, response: Response) {
    const tag = request.query.tag;
    const q = request.query.q;

    if (!tag && !q) {
      return response.status(400).json({ 
        code: 400,
        message: "Nenhuma tag requisitada." })
    }

    const result : any = !tag ? await Tool.find({ title: q }) : await Tool.find({ tags: tag });

    if (result[0] === undefined) {
      return response.status(404).json({
        code: 404,
        message: "Nenhuma ferramenta encontrada." })
    }
    else {
      const tools = result.map((tool: any) => {
         return {
          id: tool.id,
          title: tool.title,
          link: tool.link,
          description: tool.description,
          tags: tool.tags
        }
      })
    
      return response.json(tools);
    }
  }

  async create(request: Request, response: Response) {
    const { title, link, description, tags} = request.body;
  
    if (title == null || link == null || description == null || tags == null) {
      return response.status(406).json({ message: "Informações incompletas." });
    }
  
    let id: number;
    const last: any = await Tool.find({}).sort({_id: -1}).limit(1);
   
    if (last.length === 0) {
      id = 1;
    }
    else {
      id = Number(last[0].id) + 1;
    }
     const status = await Tool.create({
      id,
      title,
      link,
      description,
      tags
    }) 
  
    if (!status) return response.status(501).json({ message: "Erro ao comunicar com banco de dados." })
  
    return response.status(201).json({ id, title, link, description, tags });
  }

  async destroy(request: Request, response: Response) {
    const { id } = request.params;
   
    const status = await Tool.deleteOne({ id: Number(id) });
  
    if (status.n === 0){
      return response.status(404).json({ 
        code: 404,
        message: `Nenhuma ferramenta encontrada com id: ${id}` })
    }else {
      return response.status(204).json();
    }
  }
}

export default ToolsController;