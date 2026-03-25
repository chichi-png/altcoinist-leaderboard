// Script to generate updated affiliate data arrays for all leaderboard sections
// Based on CSV: Affilaite Names - Sheet1 (1).csv

const csvData = [
    {name: 'Chop Snicker', xHandle: '@Pooorad', tgHandle: '@I_Love_Dogs21', xUrl: 'https://x.com/Pooorad'},
    {name: 'Born', xHandle: '@unborninfinite', tgHandle: '@veryborny', xUrl: 'https://x.com/unborninfinite'},
    {name: 'chiron', xHandle: '@chironchain', tgHandle: '@chironthetrader', xUrl: 'https://x.com/chironchain'},
    {name: 'Ace', xHandle: 'N/A', tgHandle: '@acespades34', xUrl: ''},
    {name: 'Anderson', xHandle: '@0x7_anderson', tgHandle: '@tarcioanderson', xUrl: 'https://x.com/0x7_anderson'},
    {name: 'BasePop', xHandle: '@KD11201', tgHandle: '@Kd11201', xUrl: 'https://x.com/KD11201'},
    {name: 'Altcoin Miyagi', xHandle: '@AltcoinMiyagi', tgHandle: '@altcoinmiyagi', xUrl: 'https://x.com/AltcoinMiyagi'},
    {name: 'Altcoin ALF', xHandle: '@alfy11116', tgHandle: '@aLfy116', xUrl: 'https://x.com/alfy11116'},
    {name: 'Premium Mind', xHandle: '@deepseektetra', tgHandle: '@Elohim528', xUrl: 'https://x.com/deepseektetra'},
    {name: 'Tyler Kenney', xHandle: '@thebasedfrogx', tgHandle: '@thebasedfrog', xUrl: 'https://x.com/thebasedfrogx'},
    {name: 'neolawyer 1', xHandle: '@Neolawyer1', tgHandle: '@Neolawyer', xUrl: 'https://x.com/Neolawyer1'},
    {name: 'Cryptic Tits', xHandle: '@cryptic_tits', tgHandle: '@cryptic_t', xUrl: 'https://x.com/cryptic_tits'},
    {name: 'rb3k', xHandle: '@rbthreek', tgHandle: '@rbthreek', xUrl: 'https://x.com/rbthreek'},
    {name: 'Flynn', xHandle: '@Flynn_howitt', tgHandle: '@Flynn180', xUrl: 'https://x.com/Flynn_howitt'},
    {name: 'Zeus', xHandle: '@vlagudfsfjr', tgHandle: '@zeus4r', xUrl: 'https://x.com/vlagudfsfjr'},
    {name: 'Medbdy', xHandle: '@medbdy', tgHandle: '@Medbdy7', xUrl: 'https://x.com/medbdy'},
    {name: 'MJ', xHandle: '@Vanxyrus', tgHandle: '@Vanxyrus', xUrl: 'https://x.com/Vanxyrus'},
    {name: 'Social Blocks', xHandle: 'N/A', tgHandle: '@SocialBlocks', xUrl: ''},
    {name: 'Shake', xHandle: '@Shake51_', tgHandle: '@Shake51', xUrl: 'https://x.com/Shake51_'},
    {name: 'D J', xHandle: '@NLinker777', tgHandle: '@JIHANWOOOO', xUrl: 'https://x.com/NLinker777'},
    {name: 'N30', xHandle: '@N30_cryptoo', tgHandle: '@N30_CRYPTO', xUrl: 'https://x.com/N30_cryptoo'},
    {name: 'lol', xHandle: '@karaiso4', tgHandle: '@karaiso', xUrl: 'https://x.com/karaiso4'},
    {name: 'Spenny', xHandle: '@SpennyCrypto', tgHandle: '@spennypretzel', xUrl: 'https://x.com/SpennyCrypto'},
    {name: 'sexcalibur31', xHandle: '@Sexcalibur31', tgHandle: '@sexcalibur31', xUrl: 'https://x.com/Sexcalibur31'},
    {name: 'Agori', xHandle: '@sentientom', tgHandle: '@Nouyarao', xUrl: 'https://x.com/sentientom'},
    {name: 'Debankindad', xHandle: '@DebankinDad', tgHandle: 'DebankinDad', xUrl: 'https://x.com/DebankinDad'},
    {name: 'MD!3e', xHandle: '@tibbiracer', tgHandle: '@mDiBe89', xUrl: 'https://x.com/tibbiracer'},
    {name: 'Slavic', xHandle: '@basedsnipez', tgHandle: '@slavicbased', xUrl: 'https://x.com/basedsnipez'},
    {name: '3DMax', xHandle: '@3DMax_Virtuals', tgHandle: '@oO_3Dmax', xUrl: 'https://x.com/3DMax_Virtuals'},
    {name: 'Arindewar', xHandle: '@arindewar', tgHandle: '@arrieindewarrie', xUrl: 'https://x.com/arindewar'},
    {name: 'Math', xHandle: '@mathburn666', tgHandle: '@mathburn666', xUrl: 'https://x.com/mathburn666'},
    {name: 'LC', xHandle: '@mrLCguy', tgHandle: '@cryptocchio0', xUrl: 'https://x.com/mrlcguy'},
    {name: 'jeyo', xHandle: 'N/A', tgHandle: '@jeyojeyojeyo', xUrl: ''},
    {name: 'Desp3rad0', xHandle: '@joebangsjr', tgHandle: '@BigHammer', xUrl: 'https://x.com/joebangsjr'},
    {name: 'thegardener', xHandle: '@thegardener777', tgHandle: '@thegardener777', xUrl: 'https://x.com/thegardener777'},
    {name: 'Altcoin Matcha', xHandle: '@AltcoinMatcha', tgHandle: '@AltcoinMatcha', xUrl: 'https://x.com/AltcoinMatcha'},
    {name: 'KAPO', xHandle: '@KAPOTHEGOAT01', tgHandle: '@LUCKYL1MG', xUrl: 'https://x.com/KAPOTHEGOAT01'},
    {name: 'Techy', xHandle: '@techy0x', tgHandle: '@techy0x', xUrl: 'https://x.com/techy0x'},
    {name: 'Lyvo', xHandle: '@LyvoCrypto', tgHandle: '@LyvoCrypto', xUrl: 'https://x.com/lyvocrypto'},
    {name: '_RN03xx_', xHandle: '@_RN03xx_', tgHandle: '@RN03xx', xUrl: 'https://x.com/_RN03xx_'},
    {name: 'Vince', xHandle: '@Chainriffs', tgHandle: '@Chainriffss', xUrl: 'https://x.com/Chainriffs'},
];

// Generate affiliatesData (All-time + Directory)
console.log('=== AFFILIATES DATA (All-time + Directory) ===\n');
console.log('const affiliatesData = [');
csvData.forEach((aff, i) => {
    const rank = i + 1;
    const avatar = aff.name.substring(0, 2).toUpperCase();
    const xHandleClean = aff.xHandle !== 'N/A' ? aff.xHandle.replace('@', '') : aff.tgHandle.replace('@', '');
    const imgSrc = aff.xHandle !== 'N/A' ? `assets/images/affiliates/${aff.xHandle.replace('@', '')}.jpg` : '';
    const profileUrl = aff.xUrl || '';
    const bio = `Altcoinist affiliate | Crypto trader`; // Placeholder
    const location = 'Global'; // Placeholder

    console.log(`    {rank: ${rank}, name: '${aff.name}', handle: '${aff.xHandle !== 'N/A' ? aff.xHandle : aff.tgHandle}', avatar: '${avatar}', tweets: 0, referrals: 0, traders: 0, total: 0, imgSrc: '${imgSrc}', profileUrl: '${profileUrl}', tgHandle: '${aff.tgHandle}', bio: '${bio}', location: '${location}'},`);
});
console.log('];');

// Generate DEMO_MONTHLY_DATA
console.log('\n\n=== DEMO_MONTHLY_DATA (Monthly rankings) ===\n');
console.log('window.DEMO_MONTHLY_DATA = [');
csvData.forEach((aff, i) => {
    const rank = i + 1;
    const avatar = aff.name.substring(0, 2).toUpperCase();
    const imgSrc = aff.xHandle !== 'N/A' ? `assets/images/affiliates/${aff.xHandle.replace('@', '')}.jpg` : '';
    const profileUrl = aff.xUrl || '';

    console.log(`    {rank: ${rank}, name: '${aff.name}', handle: '${aff.xHandle !== 'N/A' ? aff.xHandle : aff.tgHandle}', avatar: '${avatar}', tweets: 0, referrals: 0, traders: 0, monthlyScore: 0, imgSrc: '${imgSrc}', profileUrl: '${profileUrl}', tgHandle: '${aff.tgHandle}'},`);
});
console.log('];');
