const fs = require("fs");
const data = require("../data.json");
const { age, date } = require("../utils");
const Intl = require("intl");

exports.index = (req, res) => {
  return res.render("members/index", { members: data.members });
};

exports.create = (req, res) => {
  return res.render("members/create");
};

exports.post = (req, res) => {
  const keys = Object.keys(req.body);
  for (key of keys) {
    req.body[key];
    if (req.body[key] == "") return res.send("Please, check all fields");
  }

  let { avatar_url, birth, name, services, gender } = req.body;

  birth = Date.parse(birth);
  const created_at = Date.now();
  const id = Number(data.members.length) + 1;

  data.members.push({
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at,
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error");
    return res.redirect("/");
  });
};

exports.show = (req, res) => {
  const { id } = req.params;

  const foundMember = data.members.find((member) => {
    return id == member.id;
  });

  if (!foundMember) return res.send("Member not found!");

  const member = {
    ...foundMember,
    age: age(foundMember.birth),
  };

  return res.render("members/show", { member });
};

exports.edit = (req, res) => {
  const { id } = req.params;

  const foundMember = data.members.find((member) => {
    return id == member.id;
  });

  if (!foundMember) return res.send("Member not found!");

  const member = {
    ...foundMember,
    birth: date(foundMember.birth),
  };

  return res.render("members/edit", { member });
};

exports.put = (req, res) => {
  const { id } = req.body;
  let index = 0;

  const foundMember = data.members.find((member, foundIndex) => {
    if (id == member.id) {
      index = foundIndex;
      return true;
    }
  });

  if (!foundMember) return res.send("Member not found!");

  const member = {
    ...foundMember,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id),
  };

  data.members[index] = member;
  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write error!");
    return res.redirect(`/members${id}`);
  });
};

exports.delete = (req, res) => {
  const { id } = req.body;

  const filteredMembers = data.members.filter((member) => {
    return member.id != id;
  });

  data.members = filteredMembers;

  fs.writeFile(
    "data.json",
    JSON.stringify(data, null, (err) => {
      if (err) return res.send("Write File ERROR");

      return res.redirect("/members");
    })
  );
};
