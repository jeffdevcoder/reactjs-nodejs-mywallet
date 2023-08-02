export function usuarioJaCadastrado(message) {
    const error = new Error(message);
    error.name = "UsuarioJaCadastradoError";
    return error;
};
  
export function usuarioNaoEncontrado(message) {
    const error = new Error(message);
    error.name = "UsuarioNaoEncontradoError";
    return error;
};
  
export function senhaIncorreta(message) {
    const error = new Error(message);
    error.name = "SenhaIncorretaError";
    return error;
};
  
export function tokenInvalido(message) {
    const error = new Error(message);
    error.name = "TokenInvalidoError";
    return error;
};
  
export function naoHaUsuarioEmSessoes(message) {
    const error = new Error(message);
    error.name = "NaoHaUsuarioEmSessoesError";
    return error;
};
 
export function nenhumRegistroEncontrado(message) {
    const error = new Error(message);
    error.name = "NenhumRegistroEncontradoError";
    return error;
};