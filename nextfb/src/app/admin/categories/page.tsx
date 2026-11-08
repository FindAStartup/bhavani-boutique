import CategoriesManager from '@/components/admin/CategoriesManager';
import { listCategories } from '@/server/repositories/category.repo';

export default async function CategoriesPage() {
    return <CategoriesManager categories={await listCategories()} />;
}
