
function calcPower(myHeight, myMass,bicMass,bagMass,tireDia,airTemp,windVelocity,roadSlope,myInclin,myVelocity )

{
    road = 1.0 //滑らかな舗装
    resist=0.008
    w=38  //シティサイクル
    dress=1.1 

    result = {}

    var BMI = myMass/Math.pow(0.01*myHeight,2);

    var bodyIndex = Math.sqrt(BMI/22);
    var heightIndex = myHeight/170;
    var trunkAngle = Math.PI*myInclin/180;

    var faceW = 0.14;
    var shoulderW = 0.45;
    var shoulderT = 0.12;
    var trunkW = 0.4;
    var arm2W = 0.16;
    var leg2W = 0.24;

    var faceA = 0.12*0.01*myHeight*heightIndex*faceW;
    var shoulderA = heightIndex*shoulderW*heightIndex*shoulderT;
    var trunkA = 0.4*0.01*myHeight*heightIndex*trunkW;
    var armA = 0.32*0.01*myHeight*heightIndex*arm2W;
    var legA = 0.45*0.01*myHeight*heightIndex*leg2W;
    var bodyA = 1*faceA + trunkA*Math.sin(trunkAngle) + shoulderA*Math.cos(trunkAngle) + armA*Math.sin(trunkAngle) + 1*legA;
    var myArea = bodyA*bodyIndex*dress;
    var bicArea = tireDia*0.001*w*0.001;
    var area = 1*myArea + 1*bicArea;
    var velo = 0.2778*myVelocity; 
    var totalvelo = 1*velo + 1*windVelocity;
    var totalMass = 1*myMass + 1*bicMass + 1*bagMass;
    var rollResist = road*resist*totalMass*9.81;

    var Cd = 0.5;
    var density = 1.29*273/(273 + 1*airTemp);
    var AirResist = Cd*density*area*Math.pow(totalvelo,2)/2;
    var slopeAngle = Math.atan(0.01*roadSlope);
    var slopeResist = Math.sin(slopeAngle)*totalMass*9.81;
    var totalResist = 1*rollResist + 1*AirResist + 1*slopeResist;

    var drivelossP = 0.04*totalResist*velo;
    var DriveLossP = drivelossP;
    result["DriveLossP"] = DriveLossP;

    var rollresistP = rollResist*velo;
    var RollResistP = rollresistP;
    result["RollResistP"] = RollResistP; 

    var airresistP = AirResist*velo;
    var AirResistP = airresistP;
    result["AirResistP"] = AirResistP;

    var sloperesistP = slopeResist*velo;
    var SlopeResistP = sloperesistP;
    result["SlopeResistP"]= SlopeResistP; 

    var TotalReqPower = (1*RollResistP + 1*AirResistP + 1*SlopeResistP + 1*DriveLossP).toFixed(2);
    result["TotalReqPower"] = TotalReqPower;

    var perrollResist = Math.round(1000*RollResistP/TotalReqPower)/10;
    result["perRollResist"] = perrollResist;

    var perairResist = Math.round(1000*AirResistP/TotalReqPower)/10;
    result["perAirResist"] = perairResist;

    var perslopeResist = Math.round(1000*SlopeResistP/TotalReqPower)/10;
    result["perSlopeResist"] = perslopeResist;

    var perreqPower = 100;
    result["perReqPower"]= perreqPower;

    var perdriveLoss = 100 - perrollResist - perairResist - perslopeResist;
    var perDriveLoss = Math.round(10*perdriveLoss)/10;
    result["perDriveLoss"] = perDriveLoss;

    var powerweightratio = 0.1*Math.round(10*TotalReqPower/myMass);
    result["PowerWeightRatio"] = powerweightratio;

    return result
}

function generate_velocity2watt(myHeight, myMass){
    let ret = [] 
    for (let v = 0; v <= 50; v+=0.5){
        watt = calcPower(myHeight, myMass,15,0,700,25,0,0,80,v ).TotalReqPower
        dict = { "velocity": v,
                  "watt": watt
               }
         ret.push(dict)
    }
    return ret 
}


