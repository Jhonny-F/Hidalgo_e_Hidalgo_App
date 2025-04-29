import { Routes } from '@angular/router';

export const AdminPages: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'warehouse',
                pathMatch: 'full'
            },
            {
                path: 'warehouse',
                title: 'Bodegueros | Hidalgo e Hidalgo',
                data: {
                    icon: 'fa-solid fa-warehouse',
                    label: 'Bodegueros'
                },
                loadComponent: () => import('../modules/bodegueros/warehouse-home/warehouse-home.component').then(c => c.WarehouseHomeComponent),
            },
            {
                path: 'machinery',
                title: 'Maquinarias | Hidalgo e Hidalgo',
                data: {
                    icon: 'fa-solid fa-truck-monster',
                    label: 'Maquinarias'
                },
                loadComponent: () => import('../modules/maquinarias/machinery-home/machinery-home.component').then(c => c.MachineryHomeComponent),
            },
            {
                path: 'materials',
                title: 'Materiales de Construcción | Hidalgo e Hidalgo',
                data: {
                    icon: 'fa-solid fa-cubes',
                    label: 'Materiales'
                },
                loadComponent: () => import('../modules/materiales-construccion/materials-home/materials-home.component').then(c => c.MaterialsHomeComponent),
            },
            {
                path: 'supplies',
                title: 'Insumos | Hidalgo e Hidalgo',
                data: {
                    icon: 'fa-solid fa-boxes-stacked',
                    label: 'Insumos'
                },
                loadComponent: () => import('../modules/insumos/supplies-home/supplies-home.component').then(c => c.SuppliesHomeComponent),
            },
            {
                path: 'dispatches',
                title: 'Despachos a Obras | Hidalgo e Hidalgo',
                data: {
                    icon: 'fa-solid fa-truck-arrow-right',
                    label: 'Despachos'
                },
                loadComponent: () => import('../modules/despachos-obras/dispatches-home/dispatches-home.component').then(c => c.DispatchesHomeComponent),
            },
        ]
    }
];
