import { Router } from '@angular/router';
import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/common/toast.service';
import { CredentialsModel } from '@core/models/credentials-model';
import { SocialMedia, SocialMediaService } from '@core/services/social-media.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent implements OnInit {

  public form!: FormGroup;
  public socialMedia: SocialMedia[] = [];
  public isLoading = signal<boolean>(false);
  public isPasswordVisible = signal<boolean>(false);

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _authService: AuthService,
    private _socialService: SocialMediaService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.initializeSocialMedia();
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible.set(!this.isPasswordVisible);
  }

  onSubmit(): void {

    if (this.isLoading() || this.form.invalid) {
      this.form.markAllAsTouched();
      this._toast.error('Por favor, verifica la información ingresada.');
      return;
    }

    const body = this.extractCredentials();

    this.isLoading.set(true);
    this._authService.login(body).subscribe({
      next: (response) => {
    
        if (!response) {
          this._toast.error('Usuario o contraseña incorrectos.');
          return;
        }
    
        this._toast.success(`¡Bienvenido, ${response}!`);
        this._router.navigate(['/admin']);
        this.form.reset();
      },
      error: () => this.isLoading.set(false),
      complete: () => this.isLoading.set(false),
    });

    this.form.reset();
  }

  private extractCredentials(): CredentialsModel {
    return {
      username: this.username.value,
      password: this.password.value,
    }
  }

  private initializeSocialMedia(): void {
    this.socialMedia = this._socialService.getSocialMediaLinks()
  }

  private buildForm(): void {
    this.form = this._fb.group({
      username: ['', [Validators.required, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  get username() { return this.form.get('username')! }
  get password() { return this.form.get('password')! }

}
