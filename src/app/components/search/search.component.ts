// search.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../service/paciente.service';
import { PacienteModel } from '../models/paciente.model';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  resultados: PacienteModel[]=[];
  pacientes: PacienteModel[] = [];
  pacientesFiltrados: PacienteModel[] = [];
  usuarioLogin: string;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.usuarioLogin = localStorage.getItem('userName');
  }

  onSearch(): void {
    const value = this.searchForm.get('searchTerm')?.value;
    if (value) {
      this.pacienteService.buscarPacientes(value).subscribe(
        
        pacientes => {
          this.pacientes = pacientes;

          this.pacientesFiltrados = pacientes;
          this.pacientesFiltrados = this.pacientes.filter(paciente => paciente.registrador === this.usuarioLogin);
          this.resultados = this.pacientesFiltrados;
           // console.log(this.pacientesFiltrados)

        }
      );
    } else {
      this.resultados = [];
    }
  }

  buscar(): void {
    this.onSearch();
  }

  verDetalle(nombre: string): void {
    this.router.navigate(['/pacientes/paciente', nombre]);
  }
}
