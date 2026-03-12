export async function onRequestPost(context) {
    const {password} = await context.request.json();
    const validPassword = context.env.AFFILIATE_PASSWORD;

    return new Response(JSON.stringify({
        valid: password === validPassword
    }), {
        headers: {'Content-Type': 'application/json'}
    });
}
