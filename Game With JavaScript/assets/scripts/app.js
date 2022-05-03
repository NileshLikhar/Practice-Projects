const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK'; //MODE_ATTACK = 0
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';// MODE_STRONG_ATTACK = 1
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STROMG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTAACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enteredValue = prompt("Maximum life for you and monster.",'100');

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if(isNaN(chosenMaxLife) || chosenMaxLife <=0){
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeLog(ev,val,monsterHealth,playerHealth){
    let logEntry = {
            event: ev,
            values: val,
            finalMosterHealdh: monsterHealth,
            finalPlayer: playerHealth
    };
    switch(ev) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry = {
                event: ev,
                values: val,
                target: 'MONSTER',
                finalMosterHealdh: monsterHealth,
                finalPlayer: playerHealth
            };
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry = {
                event: ev,
                values: val,
                target: 'PLAYER',
                finalMosterHealdh: monsterHealth,
                finalPlayer: playerHealth
            };
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry = {
                event: ev,
                values: val,
                target: 'PLAYER',
                finalMosterHealdh: monsterHealth,
                finalPlayer: playerHealth
            };
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: ev,
                values: val,
                finalMosterHealdh: monsterHealth,
                finalPlayer: playerHealth
            };
            break;
        default:
            logEntry = {};
    }

   /* if(ev === LOG_EVENT_PLAYER_ATTACK){
        logEntry.target = 'MONSTER';
    }else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry = {
            event: ev,
            values: val,
            target: 'MONSTER',
            finalMosterHealdh: monsterHealth,
            finalPlayer: playerHealth
    };
    }else if (ev === LOG_EVENT_MONSTER_ATTACK) {
        logEntry = {
            event: ev,
            values: val,
            target: 'PLAYER',
            finalMosterHealdh: monsterHealth,
            finalPlayer: playerHealth
    };
    }else if (ev === LOG_EVENT_PLAYER_HEAL) {
        logEntry = {
            event: ev,
            values: val,
            target: 'PLAYER',
            finalMosterHealdh: monsterHealth,
            finalPlayer: playerHealth
    };
    }else if (ev === LOG_EVENT_GAME_OVER) {
        logEntry = {
            event: ev,
            values: val,
            finalMosterHealdh: monsterHealth,
            finalPlayer: playerHealth
        };
    }*/
    battleLog.push(logEntry);
}
function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE)
    currentPlayerHealth -=playerDamage;
        writeLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
        );


    if(currentPlayerHealth <=0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('You would be dead but the bonus life saved you!');
    }

   if  (currentMonsterHealth <= 0 &&  currentPlayerHealth > 0) {
        alert('hey! you won');
        writeLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
            );
    
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0)  {
        alert ('you lost!');
        writeLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
            );
    } else if (currentPlayerHealth <=0 && currentMonsterHealth <=0){
        alert('You have a draw');
        writeLog(
            LOG_EVENT_GAME_OVER,
            'MATCH DRAW',
            currentMonsterHealth,
            currentPlayerHealth
            );
    }
    if (currentMonsterHealth <=0 ||  currentPlayerHealth<=0) {
           reset();
       }
    }

function attackMonster(mode) {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_STRONG_ATTACK ? STRONG_ATTACK_VALUE : LOG_EVENT_PLAYER_STRONG_ATTACK;

  /* if(mode === MODE_ATTACK){
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    }else if (mode === MODE_STRONG_ATTACK){
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;*/
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -=damage;
    writeLog(
        logEvent,
        damage,
        currentMonsterHealth,
        currentPlayerHealth
        );
   endRound();
}


function attackHandler() {
attackMonster(MODE_ATTACK) ; 
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK) ;
}

function healPlayerHandler() {
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert('You cant to more than your max initial health');
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(HEAL_VALUE);
    currentPlayerHealth +=HEAL_VALUE;
    writeLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
        );
    endRound();
}

function printLogHandler(){

    let i = 0;
    for (const logEntry of battleLog) {
   console.log(`#${i}`);
        for(const key in logEntry ){
            console.log(`${key} => ${logEntry[key]}`);
           
        }
        console.log('##########################################');
        i++;
    }
} 

attackBtn.addEventListener('click',attackHandler);
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);