import { Request, Response } from 'express';
import { ContactsService } from '../services/contacts.service';
import { ResponseUtil } from '../utils/response.util';
import { AuthRequest } from '../middleware/auth.middleware';

const contactsService = new ContactsService();

export class ContactsController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const contact = await contactsService.create(req.body);
      ResponseUtil.success(res, contact, 'Contact created successfully', 201);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to create contact', 500, error);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { language } = req.query as { language?: 'en' | 'ru' | 'arm' };
      const contact = await contactsService.findById(id, language || 'en');
      
      if (!contact) {
        ResponseUtil.error(res, 'Contact not found', 404);
        return;
      }
      
      ResponseUtil.success(res, contact);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to get contact', 500, error);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const contacts = await contactsService.list(req.query as any);
      ResponseUtil.success(res, contacts, 'Contacts retrieved successfully');
    } catch (error: any) {
      console.error('Contacts list error:', error);
      // If database connection fails, return empty array instead of error
      if (error.code === 'P1001' || error.message?.includes('connect') || error.message?.includes('database')) {
        ResponseUtil.success(res, [], 'Database not connected - showing empty results');
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to list contacts', 500, error);
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const contact = await contactsService.update(id, req.body);
      ResponseUtil.success(res, contact, 'Contact updated successfully');
    } catch (error: any) {
      if (error.code === 'P2025') {
        ResponseUtil.error(res, 'Contact not found', 404);
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to update contact', 500, error);
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await contactsService.delete(id);
      ResponseUtil.success(res, null, 'Contact deleted successfully');
    } catch (error: any) {
      if (error.code === 'P2025') {
        ResponseUtil.error(res, 'Contact not found', 404);
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to delete contact', 500, error);
    }
  }

  async submitForm(req: Request, res: Response): Promise<void> {
    try {
      const submission = await contactsService.submitForm(req.body);
      ResponseUtil.success(res, submission, 'Contact form submitted successfully', 201);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to submit contact form', 500, error);
    }
  }

  async getSubmissions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await contactsService.getSubmissions(req.query as any);
      ResponseUtil.paginated(
        res,
        result.data,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
        'Contact form submissions retrieved successfully'
      );
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to get submissions', 500, error);
    }
  }
}

