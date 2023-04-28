import {  ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn, UrlTree, Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(!authService.isLoggedIn()) {
    router.navigate(['login'])
    return false
  }
  return true;
};
export const AuthNotGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isLoggedIn()) {
    console.log(route.url )
    // if(route.url === "/login")
    router.navigate(['projects'])
    return false
  }

  return true;
};
