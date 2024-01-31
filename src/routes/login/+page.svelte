<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase/firebase';
  import { authStore } from '$lib/store/auth.store';
  import { getToastStore } from '@skeletonlabs/skeleton';
  import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';

  const toastStore = getToastStore();

    let email ="" ;
    let password = "" ;
    let confirmPassword = "" ;
    let register = false;
    let authenticating = false;
  
    const handleAuth = async () => {
      if (authenticating) {return}
      if (!email || !password || register && !confirmPassword) {
        const t: ToastSettings = {
          message: 'Las contraseñas no coinciden',
        };
        toastStore.trigger(t);
        return
      }
      authenticating=true
      try {
        if (!register) {
          await authStore.authHandlers.login(email, password)
        } else {
          await authStore.authHandlers.signup(email, password)
        }
      } catch (error) {
        return
      }
      if (!auth.currentUser) {
        authenticating=false
        const t: ToastSettings = {
          message: 'Contraseña o email invalido',
          background: 'variant-filled-error',
        };
        toastStore.trigger(t);
        return 
      }
      goto("/")
    }
  </script>
  
  <div class="h-screen flex flex-col items-center justify-center p-6 flex-1">
    <form class="flex flex-col gap-y-4 my-0 mx-auto justify-center items-center" action="">
      <h1 class="h1">{register ? "REGISTRO" : "LOGIN"}</h1>
      <label class="label">
        <input class="min-w-64 p-2 text-md w-full input" type="email" bind:value={email} placeholder="email" />
      </label>
      <label class="label" for="">
        <input class="min-w-64 p-2 text-md w-full input" type="password" bind:value={password} placeholder="password">
      </label>
      {#if register}
        <label class="label" for="">
          <input class="min-w-64 p-2 text-md w-full input" type="password" bind:value={confirmPassword} placeholder="confirm password">
        </label>
      {/if}
      <div class="flex flex-row">
        {#if register}
          <p class="h5">Ya tienes cuenta?</p>
          <button class="h5 text-primary-500 font-bold" on:click={() => {register=!register}}>&nbsp;LOGUEATE</button>
        {:else}
          <p class="h5">No tienes cuenta? </p>
          <button class="h5 text-primary-500 font-bold" on:click={() => {register=!register}}>&nbsp;REGISTRATE</button>
        {/if}
      </div>
      <button class="w-48 h-12 btn border-2 bg-tertiary-800 border-tertiary-500" disabled={authenticating} type="button" on:click={handleAuth}>
        {#if authenticating}
          <svg class="animate-spin h-12" viewBox="0 0 32 32">
            <path fill="currentColor" d="M16 3a3 3 0 1 0 .002 6.002A3 3 0 0 0 16 3M8.937 6.438a2.502 2.502 0 0 0-2.5 2.5c0 1.378 1.122 2.5 2.5 2.5a2.5 2.5 0 0 0 0-5m14.126 1.5c-.551 0-1 .449-1 1c0 .55.449 1 1 1c.55 0 1-.45 1-1c0-.551-.45-1-1-1M6 13.75a2.25 2.25 0 1 0 .001 4.501A2.25 2.25 0 0 0 6 13.75m20 1a1.25 1.25 0 1 0-.002 2.498A1.25 1.25 0 0 0 26 14.75M8.937 21.063c-1.105 0-2 .894-2 2a1.999 1.999 0 1 0 4 0c0-1.106-.894-2-2-2m14.126.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M16 24.25c-.965 0-1.75.785-1.75 1.75s.785 1.75 1.75 1.75s1.75-.785 1.75-1.75s-.785-1.75-1.75-1.75" />
          </svg>
        {:else}
          {#if register}
            REGISTRATE
          {:else}
            LOGIN
          {/if}
        {/if}
      </button>
    </form>
  </div>