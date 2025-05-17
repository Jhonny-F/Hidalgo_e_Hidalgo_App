import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MachineryModel } from '@core/models/machinery-model';

@Injectable({
    providedIn: 'root'
})
export class MachineryService {

    private machineryList: MachineryModel[] = [
        {
            id: 1, name: "Excavadora 320D", type: "Excavadora",
            brand: "Caterpillar", model: "320D", originCountry: "EE.UU.", 
            imageUrl: "https://www.lectura-specs.es/models/renamed/orig/excavadoras-de-orugas-320d-caterpillar.jpg"
        },
        {
            id: 2, name: "Montacarga 8FGCU25", type: "Montacarga",
            brand: "Toyota", model: "8FGCU25", originCountry: "Japón", 
            imageUrl: "https://pics.equipnet.com/mp_data/images/largepic/Oct/202410413190_963704_1.jpg"
        },
        {
            id: 3, name: "Compactadora BW213", type: "Compactadora",
            brand: "Bomag", model: "BW213", originCountry: "Alemania", 
            imageUrl: "https://photo.static-viamobilis.com/9/2/10231324.jpg"
        },
        {
            id: 4, name: "Retroexcavadora 310L", type: "Retroexcavadora",
            brand: "John Deere", model: "310L", originCountry: "Canadá", 
            imageUrl: "https://i.ytimg.com/vi/N9U0Z98n0t8/maxresdefault.jpg"
        },
        {
            id: 5, name: "Grúa LTM 1055", type: "Grúa Telescópica",
            brand: "Liebherr", model: "LTM 1055", originCountry: "Alemania", 
            imageUrl: "https://www-assets.liebherr.com/media/bu-media/lhbu-lwe/images/product-detail-pages/ltm-cranes/ltm-1055-3.3/liebherr-ltm-1055-3-3-stage-1920x1080.jpg"
        }
    ];

    getAll(): Observable<MachineryModel[]> {
        return of(this.machineryList);
    }

    getById(id: number): Observable<MachineryModel | undefined> {
        const result = this.machineryList.find(m => m.id === id);
        return of(result);
    }

    create(machine: MachineryModel): Observable<void> {
        const newId = Math.max(...this.machineryList.map(m => m.id || 0), 0) + 1;
        this.machineryList.push({ ...machine, id: newId });
        return of(void 0);
    }

    update(machine: MachineryModel): Observable<void> {
        if (!machine.id) return of(void 0);

        const index = this.machineryList.findIndex(m => m.id === machine.id);
        if (index !== -1) {
            this.machineryList[index] = { ...this.machineryList[index], ...machine };
        }

        return of(void 0);
    }

    delete(id: number): Observable<void> {
        const index = this.machineryList.findIndex(m => m.id === id);
        if (index !== -1) {
            this.machineryList.splice(index, 1);
        }

        return of(void 0);
    }

}
