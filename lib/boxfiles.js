var boxfiles_old={
    anomalylog: "https://ibm.box.com/shared/static/hssd2rp19ub03rrps71c1zh23kpxfyu1.json",
    conditionindicators: "https://ibm.box.com/shared/static/ivl2djnv5yqhbnj528wjrrnxhziauchj.json",
    sensormeasurement: "https://ibm.box.com/shared/static/p13iiwphchgkouxmc6xeb2azt11gopj3.json",
    sensor_x1: "https://ibm.box.com/shared/static/ym6k4jng8nlbkeaubmssnhlwvaue5n4q.json",
    sensor_x2: "https://ibm.box.com/shared/static/dq9vewly61r7oqhrqd53133q7d757tii.json",
    sensor_x3: "https://ibm.box.com/shared/static/pehv9nkgzwpvx03kn0d4hwbvu03uu32a.json",
    equipmentanomalylog: "https://ibm.box.com/shared/static/ckbsutwujpk9vc09qyllvyvhw7d0d6qz.json",
    equipmentfailuremodel: "https://ibm.box.com/shared/static/gy7j9ci5apj1wcps6530ii2wl6wpxubx.json",
    measurement_profile: "https://ibm.box.com/shared/static/igio7p0yfy1hy2c5o8fwjp0zzi2yxcci.json",
    measurement_profile_new: "https://ibm.box.com/shared/static/ng9y3dc7r4qptrcpv5xr9gkrxl6hncmd.json",
    healthscore: "https://ibm.box.com/shared/static/f8d09pyqo7e1ff3u7uqs5ueou57a01a9.json",
    healthscoretrend: "https://ibm.box.com/shared/static/b0uvluvjwxpunbwrd06hu9nbashcbdep.json",
    equipmentavailability: "https://ibm.box.com/shared/static/jo33sa5y17t4ynlz64wr4if7pll1zeba.json",
    oee2: "https://ibm.box.com/shared/static/c3eoy1fzlxcg1jb8f3e9xzu4di30qnmq.json",
    LU30_equipment_anomaly_count: "https://ibm.box.com/shared/static/wskc6micxfrvkmgjn9ngmwlcmsg7k0qx.json",
    LU30_production_defect_count: "https://ibm.box.com/shared/static/xh8r7a115hh7ptbry3p53qloe7tx134b.json",
    faults: "https://ibm.box.com/shared/static/jv3n6ofzt231j2lpppjtgk0zvx9bqnsb.json",
    prestops: "https://ibm.box.com/shared/static/jkwdqxx9w9im3cc8bg0uikrvlipymwl0.json",
    poststops: "https://ibm.box.com/shared/static/adp6l3apkukd0mxfsp54ybegwx96nren.json",
    productionoutputwithtarget: "https://ibm.box.com/shared/static/uj676p6rs32j7q6eid70rgdslqd56q1u.json"

}

var boxfiles={
    anomalylog: "https://ibm.box.com/shared/static/9gx4zdfxlxp7vywm5quv0yhny4e0in97.json",
    conditionindicators: "https://ibm.box.com/shared/static/p1tbs17uco85n31otayqgezu9n0pmskj.json",
    sensormeasurement: "https://ibm.box.com/shared/static/p13iiwphchgkouxmc6xeb2azt11gopj3.json",
    sensor_x1: "https://ibm.box.com/shared/static/zl4ep5fnu992qkp81yh5qzawzpn8nqsf.json",
    sensor_x2: "https://ibm.box.com/shared/static/p22qv840mln6qao317k6pbh83rta77oc.json",
    sensor_x3: "https://ibm.box.com/shared/static/vikgggpy53ru2bd1l3w1vyxd1biguhpj.json",
    equipmentanomalylog: "https://ibm.box.com/shared/static/weu34c0khkf0h8i0qqj5gubfx0bihykx.json",
    equipmentfailuremodel: "https://ibm.box.com/shared/static/x1816vx54x6qseb4nlhnfkce9wtra52e.json",
    measurement_profile: "https://ibm.box.com/shared/static/lvuh6vwr3j3n0pu4a3vtn20rysc9uii1.json",
    measurement_profile_new: "https://ibm.box.com/shared/static/nio5y40lxo9v4mn5by65gu9yy4fhgjzv.json",
    healthscore: "https://ibm.box.com/shared/static/s01a6a1yyfji3rax93aeslxvr0odfamf.json",
    healthscoretrend: "https://ibm.box.com/shared/static/u6isxus6f5hpkqdscz4l2ngqu4q6c259.json",
    equipmentavailability: "https://ibm.box.com/shared/static/jpp0r2a7mzf3c8cvlcls7whu3ion82v3.json",
    oee2: "https://ibm.box.com/shared/static/5nzkadp23kr5lljjw5yw0bxuchmo2jdo.json",
    LU30_equipment_anomaly_count: "https://ibm.box.com/shared/static/ni0v580yu8braxguojwdlssfwp9oie39.json",
    LU30_production_defect_count: "https://ibm.box.com/shared/static/tdmyd9xpov1ahmbb6jnr45ocgl4c1cwa.json",
    faults: "https://ibm.box.com/shared/static/at4sdt6rcnh6hqopqschfatjjoi91yx0.json",
    prestops: "https://ibm.box.com/shared/static/uswt3w21mak9c6m008crpih5bno7o26n.json",
    poststops: "https://ibm.box.com/shared/static/hd1nv7wqb4sk8fhuz87dkienpd7cbfut.json",
    productionoutputwithtarget: "https://ibm.box.com/shared/static/9v2sybw5dqw4u78vr2k9refoxxmwa4ax.json"
}





function getBoxFile(fname){

     var filename="";
     if (boxfiles.hasOwnProperty(fname)){
         filename=boxfiles[fname];
     }

     filename=filename.replace("https://ibm.box.com","");
     console.log("boxfile",fname,"filename",filename);
     return filename;

}

exports.getBoxFile=getBoxFile;