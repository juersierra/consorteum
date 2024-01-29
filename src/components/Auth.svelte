<script>
	import { authHandlers } from "../store/store";

  let email ="" ;
  let password = "" ;
  let confirmPassword = "" ;
  let register = false;
  let error = false;
  let authenticating = false;

  const handleAuth = async () => {
    if (authenticating) {return}
    if (!email || !password || register && !confirmPassword) {
      error = true
      return
    }
    authenticating=true
    try {
      if (!register) {
        await authHandlers.login(email, password)
      } else {
        await authHandlers.signup(email, password)
        console.log('signeado');
      }
    } catch (error) {
      console.log('error on auth:', error);
      error = true;
    }
  }
</script>

<div class="flex flex-col items-center justify-center p-6 flex-1">
  <form class="max-w-full min-w-96 flex flex-col gap-y-2 my-0 mx-auto justify-center items-center" action="">
    <h1>{register ? "REGISTRO" : "LOGIN"}</h1>
    {#if error}
      <p>ERROR EN EL LOGIN</p>
    {/if}
    <label class="w-full" for="">
      <input class="w-full" type="email" bind:value={email} placeholder="email">
    </label>
    <label class="w-full" for="">
      <input class="w-full" type="password" bind:value={password} placeholder="password">
    </label>
    {#if register}
      <label class="w-full" for="">
        <input class="w-full" type="password" bind:value={confirmPassword} placeholder="confirm password">
      </label>
    {/if}
    <button class="w-8" disabled={authenticating} type="button" on:click={handleAuth}>
      {#if authenticating}
        <svg class="animate-spin" viewBox="0 0 32 32">
          <path fill="currentColor" d="M16 3a3 3 0 1 0 .002 6.002A3 3 0 0 0 16 3M8.937 6.438a2.502 2.502 0 0 0-2.5 2.5c0 1.378 1.122 2.5 2.5 2.5a2.5 2.5 0 0 0 0-5m14.126 1.5c-.551 0-1 .449-1 1c0 .55.449 1 1 1c.55 0 1-.45 1-1c0-.551-.45-1-1-1M6 13.75a2.25 2.25 0 1 0 .001 4.501A2.25 2.25 0 0 0 6 13.75m20 1a1.25 1.25 0 1 0-.002 2.498A1.25 1.25 0 0 0 26 14.75M8.937 21.063c-1.105 0-2 .894-2 2a1.999 1.999 0 1 0 4 0c0-1.106-.894-2-2-2m14.126.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M16 24.25c-.965 0-1.75.785-1.75 1.75s.785 1.75 1.75 1.75s1.75-.785 1.75-1.75s-.785-1.75-1.75-1.75" />
        </svg>
      {:else}
        <p>SUBMIT</p>
      {/if}
    </button>
  </form>
  <div class="border-blue-200 border-2">
    {#if register}
      <p>Ya tienes cuenta?</p>
      <button on:click={() => {register=!register}}>LOGUEATE</button>
    {:else}
      <p>No tienes cuenta?</p>
      <button on:click={() => {register=!register}}>REGISTRATE</button>
    {/if}
  </div>
</div>