import React from "react";
import "../../style/Ownercss/Rightbar.css";

export default function Rightbar() {
  return (
    <aside className="rightbar">
      <h3>December 2023</h3>
      <ul className="events">
        <li><strong>2</strong> Tenant meeting <span>14:00-15:00</span></li>
        <li><strong>5</strong> Property inspection <span>11:00-12:00</span></li>
        <li><strong>8</strong> Payment Review <span>09:00-10:30</span></li>
        <li><strong>1</strong> Monthly sync <span>09:30-10:30</span></li>
        <li><strong>9</strong> Monthly rent collection <span>16:00-17:00</span></li>
      </ul>
      <button className="view-btn2">View full schedule</button>
    </aside>
  );
}
