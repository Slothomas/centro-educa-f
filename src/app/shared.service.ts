import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private static readonly RUT_KEY = 'rutEstudiante';
  private static readonly ROLE_KEY = 'idtiporol';

  setLoginData(rut: string, idtiporol: number): void {
    console.log('SharedService.setLoginData - rut:', rut, 'idtiporol:', idtiporol);
    sessionStorage.setItem(SharedService.RUT_KEY, rut);
    sessionStorage.setItem(SharedService.ROLE_KEY, idtiporol.toString());
  }

  getLoginData(): { rut: string | null; idtiporol: number | null } {
    const rut = sessionStorage.getItem(SharedService.RUT_KEY);
    const idtiporol = sessionStorage.getItem(SharedService.ROLE_KEY);
    const loginData = {
      rut: rut,
      idtiporol: idtiporol ? parseInt(idtiporol) : null
    };
    console.log('SharedService.getLoginData - loginData:', loginData);
    return loginData;
  }

  clearLoginData(): void {
    console.log('SharedService.clearLoginData');
    sessionStorage.removeItem(SharedService.RUT_KEY);
    sessionStorage.removeItem(SharedService.ROLE_KEY);
  }
}
