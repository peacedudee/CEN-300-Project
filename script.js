$(".calculator input").on("input change", function (event) {
  var parameterName =  $(this).attr("id").split("calc-")[1];
  var centimeters = $(this).val()
  
  switch (parameterName) {
    case "Cr":
      $("#calc-Cr_value").html("cᵣ: " + centimeters + " × 10‾⁸ m²/sec");
      break;
    case "depth":
      var m = $(this).val();
      $("#calc-depth_value").html("Depth: " + m + " m");
      break;
      case "mv":
        var m = $(this).val();
        $("#calc-mv_value").html("mᵥ: " + m + "× 10‾⁶ m²/N");
        break;  
    case "Cz":
      $("#calc-Cz_value").html("cᵥ: " + $(this).val()+" × 10‾⁸ m²/sec");
      break;
    case "Settlement":
      $("#calc-Settlement_value").html("Allowed settlement after commencement of Construction: " + $(this).val() + " cm");
      break;
      case "diameter":
      $("#calc-diameter_value").html("Diameter of PVDs: " + $(this).val() + " cm");
      break;
    case "Settlementt":
      $("#calc-Settlementt_value").html("Time after which construction is to be started(in days): " + $(this).val() + " days");
      break;
    case "Settlementtt":
      $("#calc-Settlementtt_value").html("Area of Construction: " + $(this).val() + " m²");
      break;
    case "Loading":
      $("#calc-Loading_value").html("Average Loading: " + $(this).val() + " tonnes/m²");
      break;
    // case "Time":
    //   $("#calc-days").html("Time after which construction is to be started(in days): " + $(this).val() + " hours per week");
    //   break;
    // case "Area of Construction  (in m²)":
    //   $("#calc-Area of Construction  (in m²)_value").html("Area of Construction  (in m²): " + $(this).val() + " hours per week");
    //   break;
  }
  
  var Cr = parseFloat($("#calc-Cr").val(), 10);
  var Cz = parseFloat($("#calc-Cz").val(), 10);
  var depth = parseFloat($("#calc-depth").val(), 10);
  var mv=parseFloat($("#calc-mv").val(), 10);
  var Loading = parseFloat($("#calc-Loading").val(), 10);
  var Settlement = parseFloat($("#calc-Settlement").val(), 10);
  var diameter = parseInt($("#calc-diameter").val(), 10);
  var time_for_construction = parseFloat($("#calc-Settlementt").val(), 10);
  var area= parseFloat($("#calc-Settlementtt").val(), 10);
  var value = $(".calculator input[name='value']:checked").val();
  
  // The Harris–Benedict equations revised by Mifflin and St Jeor in 1990: 'A new predictive equation for resting energy expenditure in healthy individuals'
  // var PVD = parseFloat(10 * depth + 6.25 * Cr - 5 * Cz, 10) + (value === " Triangle" ? 5 : -161);
  // PVD = PVD * 1.2* diameter*area;
  // PVD += Loading*60*(.03 * depth*1/0.45) / 7;
  // PVD += Settlement*60*(.07 * depth*1/0.45) / 7;
  // PVD = Math.floor(PVD);

  let pf=(mv*Loading*0.01*depth);
  let pt=pf-Settlement*0.01;
  // console.log(pt);  
  let req_u=parseFloat((pt/pf));
  // console.log(u);
  let tv=Cz*(time_for_construction*24*60*60)*(0.00000001)/(depth*depth);
  // console.log(tv);
  let uz=0.0;
  if(tv<0.287) 
  {
    uz=Math.sqrt((4*tv)/3.14);
  }
  else 
  {
    uz=100-Math.pow(10,(1.7813-tv)/0.9332);
  }
  // console.log(uz);
  // console.log(value);
  let factor=parseFloat(value==="Square" ? 0.564:0.525);
  // console.log(factor);
 let k=Number.MAX_SAFE_INTEGER;
//  console.log(k);
 let ans=0;
//  console.log(ans);
 for (let s = 5; s >=0; s=s-0.01) {
//       // let s;
      // let s=1.97;
      let r=factor*s;
      // console.log(r);
      let tr=(Cr*0.00000001*time_for_construction*24*60*60)/(4*r*r);
      // console.log(tr);
      let n1=(r*100*2)/diameter;
      // console.log(n1);
      // we have taken s in the formula as 1.5, ratio of smear zone to radius of mandrel, which is general value based on research papers by Iyathurai Sathananthan and Ph.D. Candidate, Faculty of Engineering, Univ. of Wollongong, Wollongong City, NSW 2522, Australia
      // we have taken the value of permeability in region as the 1.37  
      let v=((n1*n1)*Math.log((n1/1.5)))/(n1*n1-2.25) -(3/4) + 2.25/(4*(n1*n1)) + (3*(n1*n1-2.25)*Math.log(1.5))/(n1*n1);

      let z=-1*(8*tr/v);
      // console.log(z);
      let ur=1-Math.pow(2.71828,z);
      // console.log(ur);
      let curr_u=1-((1-uz)*(1-ur));
      // console.log(curr_u);
      if(curr_u>req_u)
      {
        ans=s;
        break;
      }
 }

  let inf_area=parseFloat(value==="Square" ? ans*ans: ans*0.5*ans*1.73);
  let final=area/inf_area;
  var targetspacing = ans.toPrecision(4);
  var targetpvdpoints = parseInt(final);
  var targetlength = (final*depth).toPrecision(8);


  $("#calc-target-spacing span").html(targetspacing + "  m");
  $("#calc-target-pvdpoints span").html(targetpvdpoints + "  ");
  $("#calc-target-length span").html(targetlength + "  m");
  $("#test span").html(area + "  ");   
});